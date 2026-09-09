import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const maintenanceRouter = Router()
maintenanceRouter.use(requireAuth)

// GET /api/maintenance/kpis
maintenanceRouter.get(
  '/kpis',
  asyncHandler(async (req, res) => {
    const [[downtimeRow]] = await pool.execute(
      `SELECT COALESCE(SUM(downtime_hours), 0) AS total_hours, COUNT(*) AS event_count
       FROM downtime WHERE downtime_start >= (SELECT MAX(downtime_start) FROM downtime) - INTERVAL 14 DAY`
    )
    const [[mttrRow]] = await pool.execute(
      `SELECT COALESCE(AVG(downtime_hours), 0) AS avg_repair FROM maintenance WHERE maintenance_status = 'Completed'`
    )
    const [[activeRow]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM maintenance WHERE maintenance_status != 'Completed'`
    )
    const [[machineCountRow]] = await pool.execute('SELECT COUNT(*) AS count FROM machines')

    const totalDowntimeHours = Number(downtimeRow.total_hours)
    const eventCount = Number(downtimeRow.event_count) || 1
    // MTBF approximation: (14 days * 24h * machine count) / number of downtime events.
    const mtbf = Math.round((14 * 24 * Number(machineCountRow.count)) / eventCount)

    res.json({
      totalDowntime: { label: 'Total Downtime', value: Number(totalDowntimeHours.toFixed(1)), unit: 'hrs', change: 0 },
      mtbf: { label: 'Mean Time Between Failures', value: mtbf, unit: 'hrs', change: 0 },
      mttr: { label: 'Mean Time To Repair', value: Number(Number(mttrRow.avg_repair).toFixed(1)), unit: 'hrs', change: 0 },
      activeTasks: { label: 'Active Maintenance Tasks', value: Number(activeRow.count), unit: '', change: 0 }
    })
  })
)

// GET /api/maintenance/downtime-trend
maintenanceRouter.get(
  '/downtime-trend',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT DATE(downtime_start) AS date, SUM(downtime_hours) AS hours
       FROM downtime
       WHERE downtime_start >= (SELECT MAX(downtime_start) FROM downtime) - INTERVAL 14 DAY
       GROUP BY DATE(downtime_start) ORDER BY date`
    )
    res.json(rows.map((r) => ({ date: r.date, hours: Number(r.hours) })))
  })
)

// GET /api/maintenance/downtime-by-equipment
maintenanceRouter.get(
  '/downtime-by-equipment',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT CONCAT('EQ-', LPAD(d.machine_id, 3, '0')) AS equipment, SUM(d.downtime_hours) AS hours
       FROM downtime d
       GROUP BY d.machine_id ORDER BY hours DESC LIMIT 6`
    )
    res.json(rows.map((r) => ({ equipment: r.equipment, hours: Number(r.hours) })))
  })
)

// GET /api/maintenance/downtime-by-reason
maintenanceRouter.get(
  '/downtime-by-reason',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT downtime_reason AS reason, SUM(downtime_hours) AS hours
       FROM downtime WHERE downtime_reason IS NOT NULL
       GROUP BY downtime_reason ORDER BY hours DESC`
    )
    res.json(rows.map((r) => ({ reason: r.reason, hours: Number(r.hours) })))
  })
)

// GET /api/maintenance/tasks
maintenanceRouter.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT maintenance_id, equipment_id, maintenance_type, maintenance_status, maintenance_date
       FROM maintenance ORDER BY maintenance_date DESC LIMIT 20`
    )
    const priorityFor = (type) => (type === 'Corrective' ? 'High' : 'Medium')
    res.json(
      rows.map((r) => ({
        id: `T-${r.maintenance_id}`,
        equipment: `EQ-${String(r.equipment_id).padStart(3, '0')}`,
        issue: `${r.maintenance_type} maintenance`,
        priority: priorityFor(r.maintenance_type),
        status: r.maintenance_status,
        assignedTo: 'Unassigned',
        scheduledDate: r.maintenance_date
      }))
    )
  })
)
