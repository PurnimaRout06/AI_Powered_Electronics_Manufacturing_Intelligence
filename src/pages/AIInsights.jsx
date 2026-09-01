import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import ChatWindow from '../components/ai/ChatWindow'
import AIInsightCard from '../components/dashboard/AIInsightCard'
import { CardSkeleton, ErrorState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { aiService } from '../services/aiService'

export default function AIInsights() {
  const insightsState = useAsync(() => aiService.getInsights(), [])
  const questionsState = useAsync(() => aiService.getSuggestedQuestions(), [])

  return (
    <DashboardLayout title="AI Insights" breadcrumb="Manufacturing / AI Insights">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">AI Insights</h2>
        <p className="text-sm text-ink-muted mt-1">
          Ask questions about your manufacturing operations and get intelligent recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          {questionsState.data && <ChatWindow suggestedQuestions={questionsState.data} />}
        </Card>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-ink">Current insights</p>
          {insightsState.loading &&
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          {insightsState.error && (
            <Card>
              <ErrorState onRetry={insightsState.refetch} />
            </Card>
          )}
          {insightsState.data?.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
