import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { mlClient } from '../services/mlClient.js'
import {
  buildFailureRiskFeatures,
  buildAnomalyFeatures,
  getAllMachineIds
} from '../services/featureEngineering.js'

export const aiRouter = Router()
aiRouter.use(requireAuth)

// GET /api/ai/suggested-questions — static, matches the chat UI's chip list
aiRouter.get('/suggested-questions', (req, res) => {
  res.json([
    'Why did production decrease yesterday?',
    'Which equipment has the highest failure risk?',
    'What caused the increase in downtime?',
    'Which production line has the highest defect rate?',
    'How can we improve OEE?'
  ])
})

// GET /api/ai/insights — runs the real failure-risk and anomaly-detection
// models against each machine's latest data, plus a couple of DB-only
// insights, and returns whichever are most notable.
aiRouter.get(
  '/insights',
  asyncHandler(async (req, res) => {
    const machineIds = await getAllMachineIds()
    const insights = []

    // --- Model-based: highest failure risk machine -------------------------
    let highestRisk = null
    for (const machineId of machineIds) {
      try {
        const built = await buildFailureRiskFeatures({ machineId })
        if (!built) continue
        const prediction = await mlClient.predictFailureRisk(built.features)
        if (!highestRisk || prediction.failure_probability > highestRisk.probability) {
          highestRisk = { machineId, probability: prediction.failure_probability }
        }
      } catch (err) {
        console.error(`[ai] failure-risk prediction failed for machine ${machineId}:`, err.message)
      }
    }
    if (highestRisk && highestRisk.probability > 0.3) {
      insights.push({
        id: `AI-RISK-${highestRisk.machineId}`,
        category: 'Equipment Risk',
        icon: 'alert-triangle',
        severity: highestRisk.probability > 0.6 ? 'High' : 'Medium',
        summary: `EQ-${String(highestRisk.machineId).padStart(3, '0')} has a ${(highestRisk.probability * 100).toFixed(0)}% predicted failure risk based on recent sensor and production data.`
      })
    }

    // --- Model-based: anomaly detection -------------------------------------
    for (const machineId of machineIds) {
      try {
        const built = await buildAnomalyFeatures({ machineId })
        if (!built) continue
        const prediction = await mlClient.predictAnomaly(built.features)
        if (prediction.anomaly === 1) {
          insights.push({
            id: `AI-ANOM-${machineId}`,
            category: 'Quality Alert',
            icon: 'alert-triangle',
            severity: 'Medium',
            summary: `EQ-${String(machineId).padStart(3, '0')}'s latest production run looks statistically unusual compared to its normal operating pattern (anomaly score ${prediction.anomaly_score}).`
          })
          break // one anomaly card is enough for the overview
        }
      } catch (err) {
        console.error(`[ai] anomaly prediction failed for machine ${machineId}:`, err.message)
      }
    }

    // --- DB-only: best-performing line vs. plant average --------------------
    const [lineRows] = await pool.execute(
      `SELECT m.location AS line, SUM(p.units_produced) AS output
       FROM production p JOIN machines m ON m.machine_id = p.machine_id
       WHERE p.production_date >= (SELECT MAX(production_date) FROM production) - INTERVAL 7 DAY
       GROUP BY m.location ORDER BY output DESC`
    )
    if (lineRows.length > 1) {
      const best = lineRows[0]
      const avg = lineRows.reduce((sum, r) => sum + Number(r.output), 0) / lineRows.length
      const pctAbove = (((Number(best.output) - avg) / avg) * 100).toFixed(1)
      if (pctAbove > 0) {
        insights.push({
          id: 'AI-PROD-BEST',
          category: 'Production Opportunity',
          icon: 'trending-up',
          severity: 'Info',
          summary: `${best.line} has ${pctAbove}% higher output than the plant average over the last 7 days.`
        })
      }
    }

    res.json(insights.slice(0, 3))
  })
)

// POST /api/ai/ask — very small keyword router that answers from real
// aggregated data. Not an LLM — a good next step is wiring this to one.
aiRouter.post(
  '/ask',
  asyncHandler(async (req, res) => {
    const question = String(req.body.question || '').toLowerCase()

    if (/production|output|decrease|yesterday/.test(question)) {
      const [rows] = await pool.execute(
        `SELECT production_date, SUM(units_produced) AS total FROM production
         GROUP BY production_date ORDER BY production_date DESC LIMIT 2`
      )
      if (rows.length === 2) {
        const [latest, prior] = rows
        const change = (((Number(latest.total) - Number(prior.total)) / Number(prior.total)) * 100).toFixed(1)
        return res.json({
          title: 'Production Insight',
          summary: `Production on ${latest.production_date} was ${change}% ${change < 0 ? 'lower' : 'higher'} than the previous day.`,
          sections: [
            {
              heading: 'Numbers',
              type: 'list',
              items: [`${latest.production_date}: ${latest.total} units`, `${prior.production_date}: ${prior.total} units`]
            }
          ]
        })
      }
    }

    if (/fail|risk|equipment/.test(question)) {
      const machineIds = await getAllMachineIds()
      let worst = null
      for (const machineId of machineIds) {
        const built = await buildFailureRiskFeatures({ machineId })
        if (!built) continue
        try {
          const prediction = await mlClient.predictFailureRisk(built.features)
          if (!worst || prediction.failure_probability > worst.probability) {
            worst = { machineId, probability: prediction.failure_probability }
          }
        } catch {
          // ML service unreachable — skip this machine
        }
      }
      if (worst) {
        return res.json({
          title: 'Equipment Risk Insight',
          summary: `EQ-${String(worst.machineId).padStart(3, '0')} currently has the highest predicted failure risk on the floor.`,
          sections: [
            {
              heading: 'Model output',
              type: 'text',
              content: `The failure-risk model estimates a ${(worst.probability * 100).toFixed(0)}% probability of failure based on its most recent sensor and production data.`
            }
          ]
        })
      }
    }

    if (/downtime/.test(question)) {
      const [rows] = await pool.execute(
        `SELECT downtime_reason, SUM(downtime_hours) AS hours FROM downtime
         WHERE downtime_reason IS NOT NULL GROUP BY downtime_reason ORDER BY hours DESC LIMIT 3`
      )
      return res.json({
        title: 'Downtime Insight',
        summary: rows[0] ? `${rows[0].downtime_reason} is the largest contributor to downtime.` : 'No downtime data available.',
        sections: [
          {
            heading: 'Top reasons',
            type: 'list',
            items: rows.map((r) => `${r.downtime_reason}: ${Number(r.hours).toFixed(1)} hrs`)
          }
        ]
      })
    }

    if (/defect|quality/.test(question)) {
      const [rows] = await pool.execute(
        `SELECT m.location AS line, SUM(p.units_produced) AS total, SUM(p.units_rejected) AS rejected
         FROM production p JOIN machines m ON m.machine_id = p.machine_id GROUP BY m.location`
      )
      const withRate = rows.map((r) => ({
        line: r.line,
        rate: (Number(r.rejected) / Number(r.total || 1)) * 100
      }))
      withRate.sort((a, b) => b.rate - a.rate)
      const worst = withRate[0]
      return res.json({
        title: 'Quality Insight',
        summary: worst ? `${worst.line} has the highest defect rate of all production lines, at ${worst.rate.toFixed(1)}%.` : 'No quality data available.',
        sections: []
      })
    }

    return res.json({
      title: 'Manufacturing Insight',
      summary: "Here's what I could find for that question from the current data.",
      sections: [
        {
          heading: 'Note',
          type: 'text',
          content: 'This is a simple keyword-routed responder over live production data. Connect an LLM here for open-ended questions.'
        }
      ]
    })
  })
)
