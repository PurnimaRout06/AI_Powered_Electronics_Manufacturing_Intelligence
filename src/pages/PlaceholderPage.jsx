import DashboardLayout from '../components/layout/DashboardLayout'
import GrafanaPanel from '../components/dashboard/GrafanaPanel'

export default function PlaceholderPage({ title, breadcrumb, description, showGrafana = false }) {
  return (
    <DashboardLayout title={title} breadcrumb={breadcrumb}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
      </div>
      {showGrafana && <GrafanaPanel title={`${title} Dashboard`} height={360} />}
    </DashboardLayout>
  )
}
