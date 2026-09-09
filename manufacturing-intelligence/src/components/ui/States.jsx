import { Inbox, RefreshCcw, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import Button from './Button'

export function LoadingSkeleton({ className, rows = 1, height = 'h-4' }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={clsx('rounded-md bg-slate-100 animate-pulse', height)}
          style={{ width: `${85 - i * 8}%` }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-card shadow-card p-5">
      <div className="h-3 w-24 rounded bg-slate-100 animate-pulse mb-4" />
      <div className="h-7 w-32 rounded bg-slate-100 animate-pulse mb-3" />
      <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
    </div>
  )
}

export function ChartSkeleton({ heightClass = 'h-64' }) {
  return (
    <div className={clsx('w-full rounded-lg bg-slate-50 animate-pulse flex items-end gap-2 p-4', heightClass)}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-slate-200"
          style={{ height: `${30 + ((i * 37) % 60)}%` }}
        />
      ))}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon size={18} className="text-ink-muted" />
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="text-xs text-ink-muted mt-1 max-w-xs">{description}</p>}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong loading this data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="h-10 w-10 rounded-full bg-status-criticalBg flex items-center justify-center mb-3">
        <AlertCircle size={18} className="text-status-critical" />
      </div>
      <p className="text-sm font-medium text-ink">Couldn't load this data</p>
      <p className="text-xs text-ink-muted mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}
