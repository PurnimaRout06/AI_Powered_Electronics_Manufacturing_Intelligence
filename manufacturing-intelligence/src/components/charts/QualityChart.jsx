import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const SEVERITY_COLORS = ['#DC2626', '#D97706', '#2563EB', '#0F172A', '#64748B']

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

export function DefectsOverTimeChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTooltip />} labelFormatter={formatDate} />
        <Line type="monotone" dataKey="defects" name="Defects" stroke="#DC2626" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DefectsByTypeChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
        <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={100} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Bar dataKey="count" name="Defects" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={SEVERITY_COLORS[i % SEVERITY_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function QualityByLineChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="line" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
        <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Bar dataKey="qualityRate" name="Quality Rate %" fill="#2563EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
