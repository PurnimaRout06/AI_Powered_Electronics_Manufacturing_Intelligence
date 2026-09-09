import clsx from 'clsx'

const TONES = {
  success: 'bg-status-successBg text-status-success',
  warning: 'bg-status-warningBg text-status-warning',
  critical: 'bg-status-criticalBg text-status-critical',
  info: 'bg-status-infoBg text-status-info',
  neutral: 'bg-slate-100 text-ink-muted'
}

const STATUS_TONE = {
  running: 'success',
  operational: 'success',
  completed: 'success',
  idle: 'neutral',
  open: 'neutral',
  scheduled: 'info',
  'in progress': 'info',
  warning: 'warning',
  medium: 'warning',
  high: 'warning',
  maintenance: 'warning',
  critical: 'critical',
  stopped: 'critical',
  low: 'success'
}

export default function Badge({ children, tone, status, className, dot = false }) {
  const resolvedTone = tone || STATUS_TONE[String(status || children).toLowerCase()] || 'neutral'
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        TONES[resolvedTone],
        className
      )}
    >
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full', {
        'bg-status-success': resolvedTone === 'success',
        'bg-status-warning': resolvedTone === 'warning',
        'bg-status-critical': resolvedTone === 'critical',
        'bg-status-info': resolvedTone === 'info',
        'bg-ink-muted': resolvedTone === 'neutral'
      })} />}
      {children}
    </span>
  )
}
