import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth)

const RANGE_TO_DAYS = { today: 1, '7d': 7, '30d': 30 }

// GET /api/dashboard/kpis?range=7d
dashboardRouter.get(
  '/kpis',
  asyncHandler(async (req, res) => {
    const range = req.query.range || '7d'
    const days = RANGE_TO_DAYS[range] || 7

    const [[row]] = await pool.execute(
      `SELECT
         SUM(p.units_produced) AS total_output,
         SUM(p.units_rejected) AS total_rejected,
         AVG(p.production_time_hours) AS avg_hours,
         COALESCE((SELECT SUM(target_quantity) FROM production_targets
                   WHERE target_date >= (SELECT MAX(production_date) FROM production) - INTERVAL ${days} DAY), 0) AS total_target
       FROM production p
       WHERE p.production_date >= (SELECT MAX(production_date) FROM production) - INTERVAL ${days} DAY`
    )
    const [[downtimeRow]] = await pool.execute(
      `SELECT COALESCE(SUM(downtime_hours), 0) AS hours FROM downtime
       WHERE downtime_start >= (SELECT MAX(downtime_start) FROM downtime) - INTERVAL ${days} DAY`
    )

    const totalOutput = Number(row.total_output) || 0
    const totalRejected = Number(row.total_rejected) || 0
    const totalTarget = Number(row.total_target) || totalOutput
    const qualityRate = totalOutput ? Number((100 - (totalRejected / totalOutput) * 100).toFixed(1)) : 100
    const downtimeHours = Number(downtimeRow.hours) || 0
    const downtimePercent = Number(Math.min(100, (downtimeHours / (days * 24 * 5)) * 100).toFixed(1)) // approx vs 5 machines
    const availability = 100 - downtimePercent
    const performance = totalTarget ? Math.min(100, (totalOutput / totalTarget) * 100) : 100
    const oee = Number(((availability * performance * qualityRate) / 10000).toFixed(1))

    res.json({
      oee: { label: 'Overall Equipment Effectiveness', value: oee, unit: '%', change: 0, trend: 'up' },
      output: { label: 'Production Output', value: totalOutput, unit: 'units', change: 0, trend: 'up' },
      quality: { label: 'Quality Rate', value: qualityRate, unit: '%', change: 0, trend: 'up' },
      downtime: { label: 'Downtime', value: downtimePercent, unit: '%', change: 0, trend: 'down' },
      range
    })
  })
)
