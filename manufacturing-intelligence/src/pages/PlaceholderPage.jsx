import DashboardLayout from '../components/layout/DashboardLayout'
import GrafanaPanel from '../components/dashboard/GrafanaPanel'

// `dashboards` is an optional array of entries from
// src/config/grafanaDashboards.js — pass one or more to embed real,
// live Grafana panels instead of the generic placeholder card.
export default function PlaceholderPage({ title, breadcrumb, description, dashboards = [] }) {
  return (
    <DashboardLayout title={title} breadcrumb={breadcrumb}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
      </div>
      {dashboards.length > 0 ? (
        <div className={dashboards.length > 1 ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : ''}>
          {dashboards.map((d) => (
            <GrafanaPanel key={d.title} title={d.title} description={d.description} src={d.url} alert={d.alert} height={420} />
          ))}
        </div>
      ) : (
        <GrafanaPanel title={`${title} Dashboard`} height={360} />
      )}
    </DashboardLayout>
  )
}
