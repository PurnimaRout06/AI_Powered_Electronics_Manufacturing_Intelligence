import { AlertTriangle, TrendingUp, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const ICONS = {
  'alert-triangle': AlertTriangle,
  'trending-up': TrendingUp
}

const SEVERITY_TONE = {
  High: 'critical',
  Medium: 'warning',
  Low: 'success',
  Info: 'info'
}

export default function AIInsightCard({ insight, onViewDetails }) {
  const Icon = ICONS[insight.icon] || Sparkles

  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-muted">
          <Icon size={15} className={SEVERITY_TONE[insight.severity] === 'critical' ? 'text-status-critical' : SEVERITY_TONE[insight.severity] === 'warning' ? 'text-status-warning' : 'text-primary'} />
          <span className="text-xs font-medium">{insight.category}</span>
        </div>
        <Badge tone={SEVERITY_TONE[insight.severity]}>{insight.severity}</Badge>
      </div>

      <p className="mt-3 text-sm text-ink leading-relaxed flex-1">{insight.summary}</p>

      <Button variant="ghost" size="sm" className="mt-4 self-start -ml-3" onClick={() => onViewDetails?.(insight)}>
        View details
      </Button>
    </Card>
  )
}
