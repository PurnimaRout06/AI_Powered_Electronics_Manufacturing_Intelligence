import { pool } from '../config/db.js'

const SHIFT_ENCODING = { Morning: 0, Afternoon: 1, Night: 2 }

function dateParts(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    dayOfWeek: d.getUTCDay(), // 0 = Sunday
    isWeekend: d.getUTCDay() === 0 || d.getUTCDay() === 6 ? 1 : 0
  }
}

// Fetches the most recent production row for a machine (or a specific one
// by id) — this is the row we build a feature vector "around".
async function getProductionRow({ machineId, productionId }) {
  const where = productionId ? 'production_id = :productionId' : 'machine_id = :machineId'
  const params = productionId ? { productionId } : { machineId }
  const [rows] = await pool.execute(
    `SELECT production_id, machine_id, production_date, shift, units_produced, units_rejected, production_time_hours
     FROM production
     WHERE ${where}
     ORDER BY production_date DESC, production_id DESC
     LIMIT 1`,
    params
  )
  return rows[0] || null
}

async function getTargetQuantity(machineId, productionDate) {
  const [rows] = await pool.execute(
    `SELECT AVG(target_quantity) AS avg_target FROM production_targets
     WHERE machine_id = :machineId AND target_date = :productionDate`,
    { machineId, productionDate }
  )
  return Number(rows[0]?.avg_target) || 0
}

async function getDowntimeAggregates(machineId, productionDate) {
  const [rows] = await pool.execute(
    `SELECT
       COUNT(*) AS event_count,
       COALESCE(SUM(downtime_hours), 0) AS total_hours,
       COALESCE(AVG(downtime_hours), 0) AS avg_hours
     FROM downtime
     WHERE machine_id = :machineId AND DATE(downtime_start) = :productionDate`,
    { machineId, productionDate }
  )
  const r = rows[0]
  return {
    downtimeEventCount: Number(r.event_count),
    totalDowntimeHours: Number(r.total_hours),
    averageDowntimeHours: Number(r.avg_hours)
  }
}

async function getMaintenanceAggregates(machineId, productionDate) {
  const [rows] = await pool.execute(
    `SELECT
       COUNT(*) AS event_count,
       COALESCE(SUM(downtime_hours), 0) AS total_downtime,
       COALESCE(AVG(downtime_hours), 0) AS avg_downtime,
       COALESCE(SUM(maintenance_cost), 0) AS total_cost,
       SUM(CASE WHEN maintenance_status = 'Completed' THEN 1 ELSE 0 END) AS completed_count
     FROM maintenance
     WHERE equipment_id = :machineId AND maintenance_date = :productionDate`,
    { machineId, productionDate }
  )
  const r = rows[0]
  return {
    maintenanceEventCount: Number(r.event_count),
    totalMaintenanceDowntime: Number(r.total_downtime),
    averageMaintenanceDowntime: Number(r.avg_downtime),
    totalMaintenanceCost: Number(r.total_cost),
    completedMaintenanceCount: Number(r.completed_count)
  }
}

async function getSensorAggregates(machineId, productionDate) {
  const [rows] = await pool.execute(
    `SELECT
       AVG(sensor_value) AS mean_val,
       MIN(sensor_value) AS min_val,
       MAX(sensor_value) AS max_val,
       STDDEV_SAMP(sensor_value) AS std_val,
       COUNT(*) AS reading_count
     FROM sensors
     WHERE machine_id = :machineId AND DATE(recorded_at) = :productionDate`,
    { machineId, productionDate }
  )
  const r = rows[0]
  return {
    sensorValueMean: Number(r.mean_val) || 0,
    sensorValueMin: Number(r.min_val) || 0,
    sensorValueMax: Number(r.max_val) || 0,
    sensorValueStd: Number(r.std_val) || 0,
    sensorReadingCount: Number(r.reading_count) || 0
  }
}

// Latest reading of a specific sensor type for the machine, on or before
// the production date — used for the standalone `temperature` / `vibration`
// features every model expects.
async function getLatestSensorReading(machineId, sensorType, productionDate) {
  const [rows] = await pool.execute(
    `SELECT sensor_value FROM sensors
     WHERE machine_id = :machineId AND sensor_type = :sensorType AND DATE(recorded_at) <= :productionDate
     ORDER BY recorded_at DESC
     LIMIT 1`,
    { machineId, sensorType, productionDate }
  )
  return Number(rows[0]?.sensor_value) || 0
}

// Prior production rows for the same machine (excluding the current one),
// most recent first — used for previous_* and rolling_3_* features.
async function getPriorProductionRows(machineId, productionId, limit = 3) {
  const [rows] = await pool.execute(
    `SELECT units_produced, units_rejected FROM production
     WHERE machine_id = :machineId AND production_id < :productionId
     ORDER BY production_id DESC
     LIMIT ${Number(limit)}`,
    { machineId, productionId }
  )
  return rows
}

function rejectionRate(unitsProduced, unitsRejected) {
  if (!unitsProduced) return 0
  return Number(((unitsRejected / unitsProduced) * 100).toFixed(2))
}

/**
 * Builds the full feature set shared by the production and quality-rejection
 * models (28 features), plus the raw production row it was built from.
 */
export async function buildProductionAndQualityFeatures({ machineId, productionId } = {}) {
  const production = await getProductionRow({ machineId, productionId })
  if (!production) return null

  const { production_date: productionDate, machine_id: resolvedMachineId } = production
  const parts = dateParts(productionDate)

  const [targetQuantity, downtime, maintenance, sensorAgg, temperature, vibration, priorRows] = await Promise.all([
    getTargetQuantity(resolvedMachineId, productionDate),
    getDowntimeAggregates(resolvedMachineId, productionDate),
    getMaintenanceAggregates(resolvedMachineId, productionDate),
    getSensorAggregates(resolvedMachineId, productionDate),
    getLatestSensorReading(resolvedMachineId, 'Temperature', productionDate),
    getLatestSensorReading(resolvedMachineId, 'Vibration', productionDate),
    getPriorProductionRows(resolvedMachineId, production.production_id, 3)
  ])

  const previous = priorRows[0]
  const previousUnitsProduced = previous ? Number(previous.units_produced) : Number(production.units_produced)
  const previousRejectionRate = previous
    ? rejectionRate(previous.units_produced, previous.units_rejected)
    : rejectionRate(production.units_produced, production.units_rejected)

  const rollingWindow = priorRows.length > 0 ? priorRows : [production]
  const rolling3ProductionAvg =
    rollingWindow.reduce((sum, r) => sum + Number(r.units_produced), 0) / rollingWindow.length
  const rolling3RejectionAvg =
    rollingWindow.reduce((sum, r) => sum + rejectionRate(r.units_produced, r.units_rejected), 0) / rollingWindow.length

  // Simple daily utilization proxy: actual production time vs. an 8-hour
  // shift, capped at 100%. The original offline pipeline used a longer
  // rolling-year window; this keeps the live feature comparable in shape
  // without requiring a full historical scan on every request.
  const utilizationPercent = Math.min(100, (Number(production.production_time_hours) / 8) * 100)

  const features = {
    machine_id: resolvedMachineId,
    target_quantity: targetQuantity,
    production_time_hours: Number(production.production_time_hours),
    total_downtime_hours: downtime.totalDowntimeHours,
    downtime_event_count: downtime.downtimeEventCount,
    average_downtime_hours: downtime.averageDowntimeHours,
    utilization_percent: utilizationPercent,
    sensor_value_mean: sensorAgg.sensorValueMean,
    sensor_value_min: sensorAgg.sensorValueMin,
    sensor_value_max: sensorAgg.sensorValueMax,
    sensor_value_std: sensorAgg.sensorValueStd,
    sensor_reading_count: sensorAgg.sensorReadingCount,
    maintenance_event_count: maintenance.maintenanceEventCount,
    total_maintenance_downtime: maintenance.totalMaintenanceDowntime,
    average_maintenance_downtime: maintenance.averageMaintenanceDowntime,
    total_maintenance_cost: maintenance.totalMaintenanceCost,
    completed_maintenance_count: maintenance.completedMaintenanceCount,
    production_day: parts.day,
    production_month: parts.month,
    production_day_of_week: parts.dayOfWeek,
    is_weekend: parts.isWeekend,
    shift_encoded: SHIFT_ENCODING[production.shift] ?? 0,
    previous_units_produced: previousUnitsProduced,
    previous_rejection_rate: previousRejectionRate,
    rolling_3_production_avg: rolling3ProductionAvg,
    rolling_3_rejection_avg: rolling3RejectionAvg,
    temperature,
    vibration
  }

  return { production, features }
}

/**
 * Builds the 21-feature set the failure-risk classifier expects. Reuses
 * most of the same aggregates as buildProductionAndQualityFeatures.
 */
export async function buildFailureRiskFeatures({ machineId, productionId } = {}) {
  const result = await buildProductionAndQualityFeatures({ machineId, productionId })
  if (!result) return null
  const { production, features } = result

  const failureRiskFeatures = {
    machine_id: features.machine_id,
    units_produced: Number(production.units_produced),
    units_rejected: Number(production.units_rejected),
    target_quantity: features.target_quantity,
    production_time_hours: features.production_time_hours,
    previous_units_produced: features.previous_units_produced,
    previous_rejection_rate: features.previous_rejection_rate,
    rolling_3_production_avg: features.rolling_3_production_avg,
    rolling_3_rejection_avg: features.rolling_3_rejection_avg,
    sensor_value_mean: features.sensor_value_mean,
    sensor_value_min: features.sensor_value_min,
    sensor_value_max: features.sensor_value_max,
    sensor_value_std: features.sensor_value_std,
    sensor_reading_count: features.sensor_reading_count,
    temperature: features.temperature,
    vibration: features.vibration,
    production_day: features.production_day,
    production_month: features.production_month,
    production_day_of_week: features.production_day_of_week,
    is_weekend: features.is_weekend,
    shift_encoded: features.shift_encoded
  }

  return { production, features: failureRiskFeatures }
}

/**
 * Builds the 22-feature set the anomaly detector (IsolationForest) expects.
 */
export async function buildAnomalyFeatures({ machineId, productionId } = {}) {
  const result = await buildProductionAndQualityFeatures({ machineId, productionId })
  if (!result) return null
  const { production, features } = result

  const anomalyFeatures = {
    machine_id: features.machine_id,
    units_produced: Number(production.units_produced),
    units_rejected: Number(production.units_rejected),
    target_quantity: features.target_quantity,
    total_downtime_hours: features.total_downtime_hours,
    downtime_event_count: features.downtime_event_count,
    average_downtime_hours: features.average_downtime_hours,
    utilization_percent: features.utilization_percent,
    sensor_value_mean: features.sensor_value_mean,
    sensor_value_min: features.sensor_value_min,
    sensor_value_max: features.sensor_value_max,
    sensor_value_std: features.sensor_value_std,
    sensor_reading_count: features.sensor_reading_count,
    maintenance_event_count: features.maintenance_event_count,
    total_maintenance_downtime: features.total_maintenance_downtime,
    total_maintenance_cost: features.total_maintenance_cost,
    previous_units_produced: features.previous_units_produced,
    previous_rejection_rate: features.previous_rejection_rate,
    rolling_3_production_avg: features.rolling_3_production_avg,
    rolling_3_rejection_avg: features.rolling_3_rejection_avg,
    temperature: features.temperature,
    vibration: features.vibration
  }

  return { production, features: anomalyFeatures }
}

export async function getAllMachineIds() {
  const [rows] = await pool.execute('SELECT machine_id FROM machines ORDER BY machine_id')
  return rows.map((r) => r.machine_id)
}
