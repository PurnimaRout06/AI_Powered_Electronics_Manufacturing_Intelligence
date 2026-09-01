import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2 shadow-raised text-xs">
      <p className="font-medium text-ink mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-ink-muted">
          {p.name}: <span className="font-medium text-ink tabular-nums">{p.value}{unit}</span>
        </p>
      ))}
    </div>
  )
}

export default function EquipmentChart({ data, dataKey, name, color = '#2563EB', unit = '', height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} interval={3} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<ChartTooltip unit={unit} />} />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
