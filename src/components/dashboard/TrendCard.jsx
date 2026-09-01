import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import clsx from 'clsx'
import Card from '../ui/Card'

export default function TrendCard({ label, value, unit, change, positiveIsGood = true }) {
  const isPositive = change > 0
  const isFlat = change === 0
  const good = isFlat ? null : positiveIsGood ? isPositive : !isPositive
  const Icon = isFlat ? Minus : isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <Card>
      <p className="text-xs text-ink-muted">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-semibold tabular-nums text-ink">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-ink-muted">{unit}</span>}
        </p>
        <div
          className={clsx(
            'flex items-center gap-0.5 text-xs font-medium',
            isFlat ? 'text-ink-muted' : good ? 'text-status-success' : 'text-status-critical'
          )}
        >
          <Icon size={13} />
          {Math.abs(change)}
          {unit === '%' ? 'pp' : ''}
        </div>
      </div>
    </Card>
  )
}
