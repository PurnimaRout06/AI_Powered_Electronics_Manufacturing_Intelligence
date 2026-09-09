// Central place for every Grafana public-dashboard link so the base URL
// (host/port, or theme param) only has to change in one spot — e.g. when
// moving from local Grafana at :3000 to a real deployed Grafana instance.

// Set VITE_GRAFANA_BASE_URL in .env if Grafana isn't at localhost:3000
// (e.g. a deployed instance behind its own domain).
const GRAFANA_BASE_URL = import.meta.env.VITE_GRAFANA_BASE_URL || 'http://localhost:3000'

// UIDs copied from the "Dashboards and panels links" doc. Each one is a
// Grafana "public dashboard" share link — no login required to view.
const DASHBOARD_UIDS = {
  sensorsTrend: 'b476faef430d48c18897cc576d9308e0',
  recentMaintenanceLog: '8eb5e9b56466405a8585c467317f14e8',
  quality: '8cc0ae8ea7dd40e59f265ef5cb2e5b79',
  production: '35adbefb33a247f097fdf3b89cdcf4f1',
  machineStatus: 'cb5fc92fc08c44f3b0965385863f7a54',
  kpi: 'c3cfcfabe60648c891cb2ddf9a57e27f',
  downtime90d: '0b9956b453b6415786a089ca08f47cf9'
}

// `?theme=light` keeps the embedded panel visually consistent with the
// app's light UI instead of Grafana's default dark theme. Grafana public
// dashboards accept this as a query param on the share URL itself.
function buildUrl(uid) {
  return `${GRAFANA_BASE_URL}/public-dashboards/${uid}?theme=light`
}

export const grafanaDashboards = {
  sensorsTrend: {
    title: 'Sensors Trend',
    description: 'Temperature Trend (with alert rule) and Vibration Trend, time series.',
    url: buildUrl(DASHBOARD_UIDS.sensorsTrend),
    // From the "Dashboards and panels" doc: 1 alert rule exists, on the
    // Temperature Trend panel, firing above this threshold.
    alert: { metric: 'Temperature', threshold: 88, unit: '°C' }
  },
  recentMaintenanceLog: {
    title: 'Recent Maintenance Log',
    description: 'Recent Maintenance Log, table.',
    url: buildUrl(DASHBOARD_UIDS.recentMaintenanceLog)
  },
  quality: {
    title: 'Quality',
    description: 'Defects Over Time (time series) and Defects by Type (bar/pie chart).',
    url: buildUrl(DASHBOARD_UIDS.quality)
  },
  production: {
    title: 'Production',
    description: 'Production Trends (time series) and Total Production (stat).',
    url: buildUrl(DASHBOARD_UIDS.production)
  },
  machineStatus: {
    title: 'Machine Status',
    description: 'Machine Status, bar chart.',
    url: buildUrl(DASHBOARD_UIDS.machineStatus)
  },
  kpi: {
    title: 'KPIs',
    description: 'Defect Rate (%) and Total Downtime Hours, stats.',
    url: buildUrl(DASHBOARD_UIDS.kpi)
  },
  downtime90d: {
    title: 'Downtime (past 90 days)',
    description: 'Downtime Over Time (time series) and Downtime Reasons (pie chart).',
    url: buildUrl(DASHBOARD_UIDS.downtime90d)
  }
}
