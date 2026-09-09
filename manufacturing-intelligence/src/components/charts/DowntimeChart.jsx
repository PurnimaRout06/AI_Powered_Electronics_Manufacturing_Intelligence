import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2 shadow-raised text-xs">
      <p className="font-medium text-ink mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-ink-muted">
          {p.name || p.dataKey}: <span className="font-medium text-ink tabular-nums">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export function DowntimeTrendChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="downtimeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTooltip />} labelFormatter={formatDate} />
        <Area type="monotone" dataKey="hours" name="Downtime (hrs)" stroke="#D97706" strokeWidth={2} fill="url(#downtimeFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function DowntimeByEquipmentChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
        <YAxis dataKey="equipment" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={64} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Bar dataKey="hours" name="Hours" fill="#2563EB" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DowntimeByReasonChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="reason" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} interval={0} angle={-12} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Bar dataKey="hours" name="Hours" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
