import { BarChart3, AlertTriangle, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'

// Once a Grafana dashboard URL is available, pass it as `src` and this
// component will render the iframe instead of the placeholder. Nothing
// else in the page needs to change. Pass `alert` (e.g. { metric, threshold,
// unit }) to surface a Grafana alert rule that applies to this panel above
// the embed itself.
//
// Browsers don't reliably fire an error event for iframes blocked by
// X-Frame-Options/CSP or a refused connection (Grafana not running), so
// there's no way to auto-detect and swap in a fallback. Instead, an
// "Open in Grafana" link is always shown next to the embed — if Grafana
// isn't reachable, the iframe area will just look empty, but the link
// always works since it's a normal browser navigation, not an embed.
export default function GrafanaPanel({ title = 'Grafana Dashboard', src, height = 280, alert, description }) {
  if (src) {
    return (
      <Card padding={false} className="overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-4 pt-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{title}</p>
            {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {alert && (
              <span className="flex items-center gap-1.5 rounded-full bg-status-warningBg px-2.5 py-1 text-[11px] font-medium text-status-warning whitespace-nowrap">
                <AlertTriangle size={11} />
                Alert: {alert.metric} &gt; {alert.threshold}
                {alert.unit}
              </span>
            )}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in Grafana"
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-primary transition-colors whitespace-nowrap"
            >
              Open in Grafana
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
        <iframe title={title} src={src} style={{ height }} className="w-full border-0 mt-2" />
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
