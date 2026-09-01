import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import ProductionChart, { ProductionByLineChart } from '../components/charts/ProductionChart'
import StatusOverview from '../components/dashboard/StatusOverview'
import GrafanaPanel from '../components/dashboard/GrafanaPanel'
import { ChartSkeleton, ErrorState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { productionService } from '../services/productionService'

export default function Production() {
  const outputState = useAsync(() => productionService.getOutputSeries(), [])
  const byLineState = useAsync(() => productionService.getByLine(), [])
  const statusState = useAsync(() => productionService.getStatusSummary(), [])

  return (
    <DashboardLayout title="Production" breadcrumb="Manufacturing / Production">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">Production Analytics</h2>
        <p className="text-sm text-ink-muted mt-1">Track output against plan across every line.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <p className="text-sm font-semibold text-ink mb-4">Production Output</p>
          {outputState.loading && <ChartSkeleton />}
          {outputState.error && <ErrorState onRetry={outputState.refetch} />}
          {outputState.data && <ProductionChart data={outputState.data} />}
        </Card>

        <Card>
          <p className="text-sm font-semibold text-ink mb-4">Production Status</p>
          {statusState.loading && <ChartSkeleton heightClass="h-48" />}
          {statusState.error && <ErrorState onRetry={statusState.refetch} />}
          {statusState.data && <StatusOverview data={statusState.data} />}
        </Card>
      </div>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-ink mb-4">Production by Line</p>
        {byLineState.loading && <ChartSkeleton />}
        {byLineState.error && <ErrorState onRetry={byLineState.refetch} />}
        {byLineState.data && <ProductionByLineChart data={byLineState.data} />}
      </Card>

      <div className="mt-4">
        <GrafanaPanel title="Production Line Telemetry" />
      </div>
    </DashboardLayout>
  )
}
