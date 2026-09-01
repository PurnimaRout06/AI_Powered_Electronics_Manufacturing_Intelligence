import { BarChart3 } from 'lucide-react'
import Card from '../ui/Card'

// Once a Grafana dashboard URL is available, pass it as `src` and this
// component will render the iframe instead of the placeholder. Nothing
// else in the page needs to change.
export default function GrafanaPanel({ title = 'Grafana Dashboard', src, height = 280 }) {
  if (src) {
    return (
      <Card padding={false} className="overflow-hidden">
        <iframe title={title} src={src} style={{ height }} className="w-full border-0" />
      </Card>
    )
  }

  return (
    <Card className="flex flex-col items-center justify-center text-center" style={{ minHeight: height }}>
      <div className="h-10 w-10 rounded-full bg-primary-lighter flex items-center justify-center mb-3">
        <BarChart3 size={18} className="text-primary" />
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="text-xs text-ink-muted mt-1 max-w-xs">
        Real-time monitoring visualization will be available here.
      </p>
    </Card>
  )
}
