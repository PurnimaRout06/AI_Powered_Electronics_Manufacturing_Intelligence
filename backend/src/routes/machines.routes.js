import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const machinesRouter = Router()
machinesRouter.use(requireAuth)

// Maps DB machine status text to the frontend's status vocabulary. Health
// score can further downgrade "Operational" to "warning"/"critical".
function resolveStatus(dbStatus, healthScore) {
  const normalized = (dbStatus || '').toLowerCase()
  if (normalized.includes('maintenance')) return 'maintenance'
  if (normalized.includes('idle')) return 'idle'
  if (normalized.includes('stopped') || normalized.includes('down')) return 'critical'
  if (healthScore < 60) return 'critical'
  if (healthScore < 80) return 'warning'
  return 'running'
}

// Heuristic health score (0-100) combining recent defect rate, downtime,
// and vibration relative to a normal baseline. This is intentionally
// simple/transparent — the ML failure-risk model provides a second,
// model-based signal surfaced separately in AI Insights.
function computeHealthScore({ rejectionRatePercent, downtimeHours, vibration }) {
  let score = 100
  score -= Math.min(40, rejectionRatePercent * 2) // defects hurt most
  score -= Math.min(30, downtimeHours * 3)
  score -= Math.min(20, Math.max(0, vibration - 3) * 4) // vibration above ~3mm/s is elevated
  return Math.max(0, Math.round(score))
}

// GET /api/machines?search=&status=
machinesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, status } = req.query

    const [machines] = await pool.execute('SELECT machine_id, machine_name, location, status FROM machines')

    const results = await Promise.all(
      machines.map(async (m) => {
        const [[latestTemp]] = await pool.execute(
          `SELECT sensor_value FROM sensors WHERE machine_id = :id AND sensor_type = 'Temperature'
           ORDER BY recorded_at DESC LIMIT 1`,
          { id: m.machine_id }
        )
        const [[latestVib]] = await pool.execute(
          `SELECT sensor_value FROM sensors WHERE machine_id = :id AND sensor_type = 'Vibration'
           ORDER BY recorded_at DESC LIMIT 1`,
          { id: m.machine_id }
        )
        const [[recentProd]] = await pool.execute(
          `SELECT units_produced, units_rejected, production_time_hours
           FROM production WHERE machine_id = :id ORDER BY production_date DESC, production_id DESC LIMIT 1`,
          { id: m.machine_id }
        )
        const [[downtimeAgg]] = await pool.execute(
          `SELECT COALESCE(SUM(downtime_hours), 0) AS hours FROM downtime
           WHERE machine_id = :id AND downtime_start >= NOW() - INTERVAL 7 DAY`,
          { id: m.machine_id }
        )
        const [[maintAgg]] = await pool.execute(
          `SELECT MAX(maintenance_date) AS last_date FROM maintenance
           WHERE equipment_id = :id AND maintenance_status = 'Completed'`,
          { id: m.machine_id }
        )

        const temperature = Number(latestTemp?.sensor_value) || 0
        const vibration = Number(latestVib?.sensor_value) || 0
        const unitsProduced = Number(recentProd?.units_produced) || 0
        const unitsRejected = Number(recentProd?.units_rejected) || 0
        const rejectionRatePercent = unitsProduced ? (unitsRejected / unitsProduced) * 100 : 0
        const utilization = Math.min(100, Math.round(((Number(recentProd?.production_time_hours) || 0) / 8) * 100))
        const downtimeHours = Number(downtimeAgg?.hours) || 0

        const healthScore = computeHealthScore({ rejectionRatePercent, downtimeHours, vibration })

        return {
          id: `EQ-${String(m.machine_id).padStart(3, '0')}`,
          machineId: m.machine_id,
          name: m.machine_name,
          line: m.location,
          status: resolveStatus(m.status, healthScore),
          utilization,
          temperature: Math.round(temperature),
          vibration: Math.round(vibration * 10) / 10,
          lastMaintenance: maintAgg?.last_date || null,
          healthScore
        }
      })
    )

    let filtered = results
    if (status && status !== 'all') {
      filtered = filtered.filter((e) => e.status === status)
    }
    if (search) {
      const q = String(search).toLowerCase()
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    }

    res.json(filtered)
  })
)

// GET /api/machines/:id — id is the numeric machine_id
machinesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const machineId = Number(req.params.id)
    const [[machine]] = await pool.execute('SELECT * FROM machines WHERE machine_id = :id', { id: machineId })
    if (!machine) return res.status(404).json({ message: 'Machine not found.' })
    res.json(machine)
  })
)

// GET /api/machines/:id/timeseries — last 24 sensor readings for
// temperature/vibration/utilization charts on the equipment detail page.
machinesRouter.get(
  '/:id/timeseries',
  asyncHandler(async (req, res) => {
    const machineId = Number(req.params.id)
    const [rows] = await pool.execute(
      `SELECT sensor_type, sensor_value, recorded_at FROM sensors
       WHERE machine_id = :id ORDER BY recorded_at DESC LIMIT 96`,
      { id: machineId }
    )
    // Group by timestamp so temperature and vibration line up on the same x-axis.
    const byTime = new Map()
    for (const r of rows.reverse()) {
      const key = r.recorded_at
      if (!byTime.has(key)) byTime.set(key, { date: key, hour: new Date(key).toISOString().slice(11, 16) })
      const bucket = byTime.get(key)
      if (r.sensor_type === 'Temperature') bucket.temperature = Number(r.sensor_value)
      if (r.sensor_type === 'Vibration') bucket.vibration = Number(r.sensor_value)
    }
    res.json(Array.from(byTime.values()))
  })
)

// GET /api/machines/:id/maintenance-history
machinesRouter.get(
  '/:id/maintenance-history',
  asyncHandler(async (req, res) => {
    const machineId = Number(req.params.id)
    const [rows] = await pool.execute(
      `SELECT maintenance_id, maintenance_date, maintenance_type, maintenance_status, downtime_hours, maintenance_cost
       FROM maintenance WHERE equipment_id = :id ORDER BY maintenance_date DESC LIMIT 20`,
      { id: machineId }
    )
    res.json(
      rows.map((r) => ({
        id: `M-${r.maintenance_id}`,
        date: r.maintenance_date,
        type: r.maintenance_type,
        technician: 'Unassigned', // not modeled in the original `maintenance` table
        duration: `${r.downtime_hours}h`,
        notes: `${r.maintenance_status} — cost $${Number(r.maintenance_cost).toFixed(2)}`
      }))
    )
  })
)
