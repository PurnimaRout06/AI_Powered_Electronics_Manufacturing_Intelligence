import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const qualityRouter = Router()
qualityRouter.use(requireAuth)

// GET /api/quality/kpis
qualityRouter.get(
  '/kpis',
  asyncHandler(async (req, res) => {
    const [[row]] = await pool.execute(
      `SELECT
         SUM(p.units_produced) AS total_produced,
         SUM(p.units_rejected) AS total_rejected,
         SUM(CASE WHEN q.quality_status = 'Fail' THEN 1 ELSE 0 END) AS failed_inspections,
         COUNT(q.quality_id) AS total_inspections
       FROM production p
       LEFT JOIN quality q ON q.production_id = p.production_id
       WHERE p.production_date >= (SELECT MAX(production_date) FROM production) - INTERVAL 7 DAY`
    )
    const totalProduced = Number(row.total_produced) || 1
    const totalRejected = Number(row.total_rejected) || 0
    const rejectionRate = Number(((totalRejected / totalProduced) * 100).toFixed(2))
    const defectRate = Number((((row.failed_inspections || 0) / (row.total_inspections || 1)) * 100).toFixed(2))
    const firstPassYield = Number((100 - defectRate).toFixed(2))
    const qualityScore = Number((100 - rejectionRate).toFixed(2))

    res.json({
      firstPassYield: { label: 'First Pass Yield', value: firstPassYield, unit: '%', change: 0 },
      defectRate: { label: 'Defect Rate', value: defectRate, unit: '%', change: 0 },
      rejectionRate: { label: 'Rejection Rate', value: rejectionRate, unit: '%', change: 0 },
      qualityScore: { label: 'Quality Score', value: qualityScore, unit: '', change: 0 }
    })
  })
)

// GET /api/quality/defects-over-time
qualityRouter.get(
  '/defects-over-time',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT inspection_date AS date, SUM(defect_count) AS defects
       FROM quality
       WHERE inspection_date >= (SELECT MAX(inspection_date) FROM quality) - INTERVAL 14 DAY
       GROUP BY inspection_date ORDER BY inspection_date`
    )
    res.json(rows.map((r) => ({ date: r.date, defects: Number(r.defects) })))
  })
)

// GET /api/quality/defects-by-type
qualityRouter.get(
  '/defects-by-type',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT defect_type AS type, SUM(defect_count) AS count
       FROM quality WHERE defect_type IS NOT NULL
       GROUP BY defect_type ORDER BY count DESC`
    )
    res.json(rows.map((r) => ({ type: r.type, count: Number(r.count) })))
  })
)

// GET /api/quality/by-line
qualityRouter.get(
  '/by-line',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT
         m.location AS line,
         SUM(p.units_produced) AS total,
         SUM(p.units_rejected) AS rejected
       FROM production p
       JOIN machines m ON m.machine_id = p.machine_id
       GROUP BY m.location`
    )
    res.json(
      rows.map((r) => ({
        line: r.line,
        qualityRate: Number((100 - (Number(r.rejected) / Number(r.total || 1)) * 100).toFixed(2))
      }))
    )
  })
)

// GET /api/quality/defect-records
qualityRouter.get(
  '/defect-records',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT q.inspection_date AS date, m.location AS line, m.machine_name AS product,
              q.defect_type AS type, q.defect_count AS quantity, q.quality_status
       FROM quality q
       JOIN production p ON p.production_id = q.production_id
       JOIN machines m ON m.machine_id = p.machine_id
       ORDER BY q.inspection_date DESC LIMIT 50`
    )
    const severityFor = (count) => {
      if (count >= 20) return 'Critical'
      if (count >= 12) return 'High'
      if (count >= 6) return 'Medium'
      return 'Low'
    }
    res.json(
      rows.map((r) => ({
        date: r.date,
        line: r.line,
        product: r.product,
        type: r.type,
        quantity: Number(r.quantity),
        severity: severityFor(Number(r.quantity))
      }))
    )
  })
)
