import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import TrendCard from '../components/dashboard/TrendCard'
import { DowntimeTrendChart, DowntimeByEquipmentChart, DowntimeByReasonChart } from '../components/charts/DowntimeChart'
import { LoadingSkeleton, ChartSkeleton, ErrorState, EmptyState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { maintenanceService } from '../services/maintenanceService'

const PRIORITY_TONE = { Low: 'success', Medium: 'warning', High: 'warning', Critical: 'critical' }
const STATUS_TONE = { Open: 'neutral', Scheduled: 'info', 'In Progress': 'info', Completed: 'success' }

export default function Maintenance() {
  const kpiState = useAsync(() => maintenanceService.getKpis(), [])
  const trendState = useAsync(() => maintenanceService.getDowntimeTrend(), [])
  const byEquipmentState = useAsync(() => maintenanceService.getDowntimeByEquipment(), [])
  const byReasonState = useAsync(() => maintenanceService.getDowntimeByReason(), [])
  const tasksState = useAsync(() => maintenanceService.getTasks(), [])

  return (
    <DashboardLayout title="Maintenance" breadcrumb="Manufacturing / Maintenance">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">Maintenance</h2>
        <p className="text-sm text-ink-muted mt-1">Track downtime, reliability metrics and open maintenance work.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiState.loading &&
          Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} rows={2} className="p-5 bg-white border border-surface-border rounded-card" />)}
        {kpiState.error && (
          <div className="xl:col-span-4">
            <Card>
              <ErrorState onRetry={kpiState.refetch} />
            </Card>
          </div>
        )}
        {kpiState.data &&
          Object.values(kpiState.data).map((kpi) => (
            <TrendCard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} change={kpi.change} positiveIsGood={kpi.label !== 'Mean Time Between Failures'} />
          ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <Card>
          <p className="text-sm font-semibold text-ink mb-4">Downtime trend</p>
          {trendState.loading && <ChartSkeleton heightClass="h-56" />}
          {trendState.error && <ErrorState onRetry={trendState.refetch} />}
          {trendState.data && <DowntimeTrendChart data={trendState.data} />}
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink mb-4">Downtime by equipment</p>
          {byEquipmentState.loading && <ChartSkeleton heightClass="h-56" />}
          {byEquipmentState.error && <ErrorState onRetry={byEquipmentState.refetch} />}
          {byEquipmentState.data && <DowntimeByEquipmentChart data={byEquipmentState.data} />}
        </Card>
      </div>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-ink mb-4">Downtime by reason</p>
        {byReasonState.loading && <ChartSkeleton heightClass="h-56" />}
        {byReasonState.error && <ErrorState onRetry={byReasonState.refetch} />}
        {byReasonState.data && <DowntimeByReasonChart data={byReasonState.data} />}
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-ink mb-4">Maintenance tasks</p>
        {tasksState.loading && <LoadingSkeleton rows={4} />}
        {tasksState.error && <ErrorState onRetry={tasksState.refetch} />}
        {tasksState.data && tasksState.data.length === 0 && (
          <EmptyState title="No open maintenance tasks" description="All equipment is currently up to date." />
        )}
        {tasksState.data && tasksState.data.length > 0 && (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-xs text-ink-muted">
                  <th className="px-5 py-2 text-left font-medium">Equipment</th>
                  <th className="px-5 py-2 text-left font-medium">Issue</th>
                  <th className="px-5 py-2 text-left font-medium">Priority</th>
                  <th className="px-5 py-2 text-left font-medium">Status</th>
                  <th className="px-5 py-2 text-left font-medium">Assigned To</th>
                  <th className="px-5 py-2 text-left font-medium">Scheduled Date</th>
                </tr>
              </thead>
              <tbody>
                {tasksState.data.map((t) => (
                  <tr key={t.id} className="border-b border-surface-border last:border-0">
                    <td className="px-5 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{t.equipment}</td>
                    <td className="px-5 py-3 text-ink">{t.issue}</td>
                    <td className="px-5 py-3">
                      <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-muted whitespace-nowrap">{t.assignedTo}</td>
                    <td className="px-5 py-3 text-ink-muted whitespace-nowrap">{t.scheduledDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
