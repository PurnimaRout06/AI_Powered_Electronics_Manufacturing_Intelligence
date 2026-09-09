import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import clsx from 'clsx'
import Card from '../ui/Card'

// Deterministic tiny sparkline so it doesn't visually "reset" each render.
function sparkFrom(seed) {
  const points = []
  let v = 50
  for (let i = 0; i < 12; i++) {
    v += Math.sin(seed + i) * 8 + (i % 3 === 0 ? 4 : -2)
    points.push({ i, v: Math.max(10, v) })
  }
  return points
}

export default function KPICard({ icon: Icon, label, value, unit, change, trend, seed = 1 }) {
  const positive = trend === 'up' ? change >= 0 : change < 0
  const ChangeIcon = change >= 0 ? ArrowUpRight : ArrowDownRight

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-lighter text-primary">
          <Icon size={17} strokeWidth={2} />
        </div>
        <div
          className={clsx(
            'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
            positive ? 'bg-status-successBg text-status-success' : 'bg-status-criticalBg text-status-critical'
          )}
        >
          <ChangeIcon size={12} />
          {Math.abs(change)}%
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
        {value.toLocaleString()}
        {unit && <span className="ml-1 text-sm font-normal text-ink-muted">{unit}</span>}
      </p>

      <div className="mt-3 h-8 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkFrom(seed)} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={1.5} fill={`url(#spark-${seed})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
