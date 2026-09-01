export default function StatusOverview({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {data.map((d) => (
          <div
            key={d.status}
            style={{ width: `${(d.count / total) * 100}%`, backgroundColor: d.color }}
            className="h-full first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-ink-muted flex-1">{d.status}</span>
            <span className="text-xs font-semibold tabular-nums text-ink">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
