import { useState } from 'react'
import { Gauge, Package, ShieldCheck, TimerOff } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import KPICard from '../components/dashboard/KPICard'
import AIInsightCard from '../components/dashboard/AIInsightCard'
import StatusOverview from '../components/dashboard/StatusOverview'
import ProductionChart from '../components/charts/ProductionChart'
import Card from '../components/ui/Card'
import Dropdown from '../components/ui/Dropdown'
import { CardSkeleton, ChartSkeleton, ErrorState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { manufacturingService } from '../services/manufacturingService'
import { productionService } from '../services/productionService'

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' }
]

const KPI_ICONS = { oee: Gauge, output: Package, quality: ShieldCheck, downtime: TimerOff }

export default function Overview() {
  const [range, setRange] = useState('7d')

  const kpiState = useAsync(() => manufacturingService.getOverviewKpis(range), [range])
  const insightsState = useAsync(() => manufacturingService.getAiInsights(), [])
  const productionState = useAsync(() => productionService.getOutputSeries(), [])
  const statusState = useAsync(() => productionService.getStatusSummary(), [])

  return (
    <DashboardLayout title="Manufacturing Overview" breadcrumb="Manufacturing / Overview">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Manufacturing Overview</h2>
          <p className="text-sm text-ink-muted mt-1">
            Real-time visibility into production, equipment, quality and maintenance.
          </p>
        </div>
        <Dropdown options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiState.loading &&
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        {kpiState.error && (
          <div className="xl:col-span-4">
            <Card>
              <ErrorState onRetry={kpiState.refetch} />
            </Card>
          </div>
        )}
        {kpiState.data &&
          Object.entries(kpiState.data)
            .filter(([key]) => KPI_ICONS[key])
            .map(([key, kpi], i) => (
              <KPICard key={key} icon={KPI_ICONS[key]} label={kpi.label} value={kpi.value} unit={kpi.unit} change={kpi.change} trend={kpi.trend} seed={i + 1} />
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-ink">Production Output</p>
              <p className="text-xs text-ink-muted mt-0.5">Planned vs. actual, last 14 days</p>
            </div>
          </div>
          {productionState.loading && <ChartSkeleton />}
          {productionState.error && <ErrorState onRetry={productionState.refetch} />}
          {productionState.data && <ProductionChart data={productionState.data} />}
        </Card>

        <Card>
          <p className="text-sm font-semibold text-ink mb-4">Production Status</p>
          {statusState.loading && <ChartSkeleton heightClass="h-48" />}
          {statusState.error && <ErrorState onRetry={statusState.refetch} />}
          {statusState.data && <StatusOverview data={statusState.data} />}
        </Card>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-ink mb-4">AI-Generated Insights</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {insightsState.loading &&
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          {insightsState.error && (
            <div className="xl:col-span-3">
              <Card>
                <ErrorState onRetry={insightsState.refetch} />
              </Card>
            </div>
          )}
          {insightsState.data?.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
