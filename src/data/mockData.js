// Realistic-shaped mock data. Field names here are the contract the Express
// API should eventually satisfy — keep them stable when wiring real endpoints.

const LINES = ['Line 01', 'Line 02', 'Line 03', 'Line 04']

function dateRange(days) {
  const out = []
  const today = new Date('2026-08-31')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

export const kpis = {
  oee: { label: 'Overall Equipment Effectiveness', value: 87.4, unit: '%', change: 4.2, trend: 'up' },
  output: { label: 'Production Output', value: 12480, unit: 'units', change: 8.6, trend: 'up' },
  quality: { label: 'Quality Rate', value: 96.8, unit: '%', change: 1.8, trend: 'up' },
  downtime: { label: 'Downtime', value: 4.7, unit: '%', change: -2.1, trend: 'down' }
}

export const productionSeries = dateRange(14).map((date, i) => {
  const planned = 4000 + Math.round(Math.sin(i / 2) * 300 + i * 15)
  const actual = planned - Math.round(80 + Math.random() * 320)
  return { date, planned, actual }
})

export const productionByLine = LINES.map((line, i) => ({
  line,
  output: [4620, 4980, 3890, 4310][i],
  target: [4800, 4800, 4800, 4800][i]
}))

export const productionStatus = [
  { status: 'Running', count: 21, color: '#16A34A' },
  { status: 'Idle', count: 4, color: '#64748B' },
  { status: 'Stopped', count: 2, color: '#DC2626' },
  { status: 'Maintenance', count: 3, color: '#D97706' }
]

export const equipmentList = [
  { id: 'EQ-101', name: 'CNC Machine 01', line: 'Line 01', status: 'running', utilization: 92, temperature: 64, vibration: 2.1, lastMaintenance: '2026-08-12', healthScore: 94 },
  { id: 'EQ-102', name: 'Injection Molder 02', line: 'Line 01', status: 'running', utilization: 88, temperature: 71, vibration: 1.9, lastMaintenance: '2026-08-18', healthScore: 90 },
  { id: 'EQ-103', name: 'Robotic Welder 03', line: 'Line 02', status: 'idle', utilization: 41, temperature: 58, vibration: 1.2, lastMaintenance: '2026-07-29', healthScore: 88 },
  { id: 'EQ-104', name: 'CNC Machine 04', line: 'Line 03', status: 'warning', utilization: 84, temperature: 72, vibration: 4.8, lastMaintenance: '2026-06-30', healthScore: 76 },
  { id: 'EQ-105', name: 'Conveyor System A', line: 'Line 02', status: 'running', utilization: 96, temperature: 55, vibration: 1.5, lastMaintenance: '2026-08-20', healthScore: 97 },
  { id: 'EQ-106', name: 'Press Brake 06', line: 'Line 04', status: 'maintenance', utilization: 0, temperature: 40, vibration: 0.0, lastMaintenance: '2026-08-31', healthScore: 65 },
  { id: 'EQ-107', name: 'Laser Cutter 07', line: 'Line 03', status: 'running', utilization: 79, temperature: 68, vibration: 2.4, lastMaintenance: '2026-08-05', healthScore: 91 },
  { id: 'EQ-108', name: 'Assembly Robot 08', line: 'Line 04', status: 'critical', utilization: 55, temperature: 81, vibration: 6.3, lastMaintenance: '2026-06-14', healthScore: 48 },
  { id: 'EQ-109', name: 'Packaging Unit 09', line: 'Line 01', status: 'running', utilization: 90, temperature: 60, vibration: 1.7, lastMaintenance: '2026-08-22', healthScore: 93 },
  { id: 'EQ-110', name: 'Stamping Press 10', line: 'Line 02', status: 'running', utilization: 86, temperature: 66, vibration: 2.0, lastMaintenance: '2026-08-09', healthScore: 89 }
]

export function equipmentTimeSeries(equipmentId) {
  const base = equipmentList.find((e) => e.id === equipmentId) || equipmentList[0]
  return dateRange(24).map((date, i) => ({
    date,
    hour: `${i}:00`,
    temperature: Math.round(base.temperature - 6 + Math.random() * 12),
    vibration: +(base.vibration - 0.6 + Math.random() * 1.2).toFixed(1),
    utilization: Math.round(Math.min(100, Math.max(0, base.utilization - 15 + Math.random() * 30)))
  }))
}

export const maintenanceHistory = [
  { id: 'M-3301', equipment: 'EQ-104', date: '2026-06-30', type: 'Preventive', technician: 'R. Okafor', duration: '2h 10m', notes: 'Bearing lubrication, belt tension check' },
  { id: 'M-3288', equipment: 'EQ-104', date: '2026-04-11', type: 'Corrective', technician: 'S. Lindqvist', duration: '4h 45m', notes: 'Replaced drive coupling' },
  { id: 'M-3244', equipment: 'EQ-104', date: '2026-02-02', type: 'Preventive', technician: 'R. Okafor', duration: '1h 30m', notes: 'Routine inspection, no issues found' }
]

export const qualityKpis = {
  firstPassYield: { label: 'First Pass Yield', value: 94.2, unit: '%', change: 1.1 },
  defectRate: { label: 'Defect Rate', value: 3.2, unit: '%', change: -0.6 },
  rejectionRate: { label: 'Rejection Rate', value: 1.4, unit: '%', change: -0.2 },
  qualityScore: { label: 'Quality Score', value: 96.8, unit: '', change: 1.8 }
}

export const defectsOverTime = dateRange(14).map((date, i) => ({
  date,
  defects: Math.round(18 + Math.sin(i / 3) * 6 + Math.random() * 8)
}))

export const defectsByType = [
  { type: 'Dimensional', count: 42 },
  { type: 'Surface Finish', count: 31 },
  { type: 'Material', count: 18 },
  { type: 'Assembly', count: 24 },
  { type: 'Packaging', count: 9 }
]

export const qualityByLine = LINES.map((line, i) => ({
  line,
  qualityRate: [97.8, 98.1, 92.4, 96.5][i]
}))

export const defectRecords = [
  { date: '2026-08-30', line: 'Line 03', product: 'Bracket-A200', type: 'Dimensional', quantity: 12, severity: 'High' },
  { date: '2026-08-30', line: 'Line 02', product: 'Housing-B15', type: 'Surface Finish', quantity: 5, severity: 'Low' },
  { date: '2026-08-29', line: 'Line 03', product: 'Bracket-A200', type: 'Dimensional', quantity: 8, severity: 'Medium' },
  { date: '2026-08-29', line: 'Line 01', product: 'Panel-C04', type: 'Assembly', quantity: 3, severity: 'Low' },
  { date: '2026-08-28', line: 'Line 04', product: 'Shaft-D77', type: 'Material', quantity: 2, severity: 'Critical' },
  { date: '2026-08-28', line: 'Line 02', product: 'Housing-B15', type: 'Packaging', quantity: 14, severity: 'Low' }
]

export const maintenanceKpis = {
  totalDowntime: { label: 'Total Downtime', value: 38.4, unit: 'hrs', change: -6.2 },
  mtbf: { label: 'Mean Time Between Failures', value: 212, unit: 'hrs', change: 9.4 },
  mttr: { label: 'Mean Time To Repair', value: 3.1, unit: 'hrs', change: -0.8 },
  activeTasks: { label: 'Active Maintenance Tasks', value: 7, unit: '', change: 2 }
}

export const downtimeTrend = dateRange(14).map((date, i) => ({
  date,
  hours: +(2 + Math.sin(i / 4) * 1.4 + Math.random() * 1.2).toFixed(1)
}))

export const downtimeByEquipment = [
  { equipment: 'EQ-108', hours: 11.2 },
  { equipment: 'EQ-104', hours: 7.6 },
  { equipment: 'EQ-106', hours: 6.1 },
  { equipment: 'EQ-103', hours: 3.4 },
  { equipment: 'EQ-110', hours: 2.2 }
]

export const downtimeByReason = [
  { reason: 'Unplanned Failure', hours: 14.8 },
  { reason: 'Scheduled Maintenance', hours: 9.2 },
  { reason: 'Changeover', hours: 6.4 },
  { reason: 'Material Shortage', hours: 4.9 },
  { reason: 'Operator Wait', hours: 3.1 }
]

export const maintenanceTasks = [
  { id: 'T-501', equipment: 'EQ-108', issue: 'Excessive vibration on main spindle', priority: 'Critical', status: 'In Progress', assignedTo: 'R. Okafor', scheduledDate: '2026-09-01' },
  { id: 'T-502', equipment: 'EQ-104', issue: 'Vibration trending upward, inspect drive assembly', priority: 'High', status: 'Scheduled', assignedTo: 'S. Lindqvist', scheduledDate: '2026-09-02' },
  { id: 'T-503', equipment: 'EQ-106', issue: 'Scheduled quarterly service', priority: 'Medium', status: 'Scheduled', assignedTo: 'A. Kapoor', scheduledDate: '2026-09-03' },
  { id: 'T-504', equipment: 'EQ-103', issue: 'Calibration drift on weld sensor', priority: 'Low', status: 'Open', assignedTo: 'Unassigned', scheduledDate: '2026-09-05' },
  { id: 'T-505', equipment: 'EQ-110', issue: 'Hydraulic fluid top-off', priority: 'Low', status: 'Completed', assignedTo: 'A. Kapoor', scheduledDate: '2026-08-29' }
]

export const aiInsights = [
  {
    id: 'AI-1',
    category: 'Equipment Risk',
    icon: 'alert-triangle',
    severity: 'High',
    summary: 'Equipment E-104 shows increasing vibration levels, up 14% over the last 6 hours.'
  },
  {
    id: 'AI-2',
    category: 'Production Opportunity',
    icon: 'trending-up',
    severity: 'Info',
    summary: 'Line 02 has 7.8% higher throughput than the plant average this week.'
  },
  {
    id: 'AI-3',
    category: 'Quality Alert',
    icon: 'alert-triangle',
    severity: 'Medium',
    summary: 'Defect rate on Line 03 increased by 3.2% this week, concentrated in dimensional defects.'
  }
]

export const suggestedQuestions = [
  'Why did production decrease yesterday?',
  'Which equipment has the highest failure risk?',
  'What caused the increase in downtime?',
  'Which production line has the highest defect rate?',
  'How can we improve OEE?'
]
