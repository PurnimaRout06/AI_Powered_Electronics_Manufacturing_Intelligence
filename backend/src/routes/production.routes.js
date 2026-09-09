import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const productionRouter = Router()
productionRouter.use(requireAuth)

// GET /api/production/output?days=14 — planned (target) vs actual output per day
productionRouter.get(
  '/output',
  asyncHandler(async (req, res) => {
    const days = Number(req.query.days) || 14
    const [rows] = await pool.execute(
      `SELECT
         p.production_date AS date,
         SUM(p.units_produced) AS actual,
         COALESCE(t.planned, 0) AS planned
       FROM production p
       LEFT JOIN (
         SELECT target_date, SUM(target_quantity) AS planned
         FROM production_targets GROUP BY target_date
       ) t ON t.target_date = p.production_date
       WHERE p.production_date >= (SELECT MAX(production_date) FROM production) - INTERVAL ${days} DAY
       GROUP BY p.production_date, t.planned
       ORDER BY p.production_date`,
      {}
    )
    res.json(rows.map((r) => ({ date: r.date, planned: Number(r.planned), actual: Number(r.actual) })))
  })
)

// GET /api/production/by-line — output vs target grouped by machine location
productionRouter.get(
  '/by-line',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT
         m.location AS line,
         SUM(p.units_produced) AS output,
         COALESCE(SUM(t.target_quantity), 0) AS target
       FROM production p
       JOIN machines m ON m.machine_id = p.machine_id
       LEFT JOIN production_targets t ON t.machine_id = p.machine_id AND t.target_date = p.production_date
       WHERE p.production_date >= (SELECT MAX(production_date) FROM production) - INTERVAL 7 DAY
       GROUP BY m.location
       ORDER BY m.location`,
      {}
    )
    res.json(rows.map((r) => ({ line: r.line, output: Number(r.output), target: Number(r.target) })))
  })
)

// GET /api/production/status — machine status breakdown
productionRouter.get(
  '/status',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(`SELECT status, COUNT(*) AS count FROM machines GROUP BY status`)
    const colorFor = (status) => {
      const s = (status || '').toLowerCase()
      if (s.includes('operational') || s.includes('running')) return '#16A34A'
      if (s.includes('idle')) return '#64748B'
      if (s.includes('maintenance')) return '#D97706'
      return '#DC2626'
    }
    res.json(rows.map((r) => ({ status: r.status, count: Number(r.count), color: colorFor(r.status) })))
  })
)
