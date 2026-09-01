import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2 shadow-raised text-xs">
      <p className="font-medium text-ink mb-1">{formatDate(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-ink-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-ink tabular-nums">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

export default function ProductionChart({ data, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={48} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#64748B' }} iconType="circle" iconSize={8} />
        <Area
          type="monotone"
          dataKey="planned"
          name="Planned"
          stroke="#94A3B8"
          strokeWidth={2}
          strokeDasharray="4 3"
          fill="none"
        />
        <Area
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="#2563EB"
          strokeWidth={2}
          fill="url(#actualFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2 shadow-raised text-xs">
      <p className="font-medium text-ink mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-ink-muted">
          {p.name}: <span className="font-medium text-ink tabular-nums">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

export function ProductionByLineChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="line" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={48} />
        <Tooltip content={<LineTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#64748B' }} iconType="circle" iconSize={8} />
        <Bar dataKey="target" name="Target" fill="#DBEAFE" radius={[4, 4, 0, 0]} />
        <Bar dataKey="output" name="Output" fill="#2563EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
