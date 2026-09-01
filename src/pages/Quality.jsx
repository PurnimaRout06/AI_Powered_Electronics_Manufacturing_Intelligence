import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import TrendCard from '../components/dashboard/TrendCard'
import { DefectsOverTimeChart, DefectsByTypeChart, QualityByLineChart } from '../components/charts/QualityChart'
import { LoadingSkeleton, ChartSkeleton, ErrorState, EmptyState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { qualityService } from '../services/qualityService'

const SEVERITY_TONE = { Low: 'success', Medium: 'warning', High: 'critical', Critical: 'critical' }

export default function Quality() {
  const kpiState = useAsync(() => qualityService.getKpis(), [])
  const defectsOverTimeState = useAsync(() => qualityService.getDefectsOverTime(), [])
  const defectsByTypeState = useAsync(() => qualityService.getDefectsByType(), [])
  const byLineState = useAsync(() => qualityService.getQualityByLine(), [])
  const recordsState = useAsync(() => qualityService.getDefectRecords(), [])

  return (
    <DashboardLayout title="Quality" breadcrumb="Manufacturing / Quality">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">Quality Analytics</h2>
        <p className="text-sm text-ink-muted mt-1">Track yield, defects and rejections across the plant.</p>
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
            <TrendCard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} change={kpi.change} />
          ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <Card>
          <p className="text-sm font-semibold text-ink mb-4">Defects over time</p>
          {defectsOverTimeState.loading && <ChartSkeleton heightClass="h-56" />}
          {defectsOverTimeState.error && <ErrorState onRetry={defectsOverTimeState.refetch} />}
          {defectsOverTimeState.data && <DefectsOverTimeChart data={defectsOverTimeState.data} />}
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink mb-4">Defects by type</p>
          {defectsByTypeState.loading && <ChartSkeleton heightClass="h-56" />}
          {defectsByTypeState.error && <ErrorState onRetry={defectsByTypeState.refetch} />}
          {defectsByTypeState.data && <DefectsByTypeChart data={defectsByTypeState.data} />}
        </Card>
      </div>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-ink mb-4">Quality by production line</p>
        {byLineState.loading && <ChartSkeleton heightClass="h-56" />}
        {byLineState.error && <ErrorState onRetry={byLineState.refetch} />}
        {byLineState.data && <QualityByLineChart data={byLineState.data} />}
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-ink mb-4">Defect records</p>
        {recordsState.loading && <LoadingSkeleton rows={4} />}
        {recordsState.error && <ErrorState onRetry={recordsState.refetch} />}
        {recordsState.data && recordsState.data.length === 0 && (
          <EmptyState title="No defects recorded" description="No defects have been logged for the selected period." />
        )}
        {recordsState.data && recordsState.data.length > 0 && (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-xs text-ink-muted">
                  <th className="px-5 py-2 text-left font-medium">Date</th>
                  <th className="px-5 py-2 text-left font-medium">Line</th>
                  <th className="px-5 py-2 text-left font-medium">Product</th>
                  <th className="px-5 py-2 text-left font-medium">Defect Type</th>
                  <th className="px-5 py-2 text-left font-medium">Quantity</th>
                  <th className="px-5 py-2 text-left font-medium">Severity</th>
                </tr>
              </thead>
              <tbody>
                {recordsState.data.map((d, i) => (
                  <tr key={i} className="border-b border-surface-border last:border-0">
                    <td className="px-5 py-3 text-ink-muted whitespace-nowrap">{d.date}</td>
                    <td className="px-5 py-3 text-ink whitespace-nowrap">{d.line}</td>
                    <td className="px-5 py-3 text-ink whitespace-nowrap">{d.product}</td>
                    <td className="px-5 py-3 text-ink-muted">{d.type}</td>
                    <td className="px-5 py-3 tabular-nums text-ink-muted">{d.quantity}</td>
                    <td className="px-5 py-3">
                      <Badge tone={SEVERITY_TONE[d.severity]}>{d.severity}</Badge>
                    </td>
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
