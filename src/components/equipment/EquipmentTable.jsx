import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, Thermometer, Activity } from 'lucide-react'
import EquipmentStatus from './EquipmentStatus'
import { EmptyState } from '../ui/States'

const COLUMNS = [
  { key: 'id', label: 'Equipment ID' },
  { key: 'name', label: 'Name' },
  { key: 'line', label: 'Line' },
  { key: 'status', label: 'Status' },
  { key: 'utilization', label: 'Utilization' },
  { key: 'temperature', label: 'Temp' },
  { key: 'vibration', label: 'Vibration' },
  { key: 'healthScore', label: 'Health' }
]

function healthColor(score) {
  if (score >= 85) return 'bg-status-success'
  if (score >= 65) return 'bg-status-warning'
  return 'bg-status-critical'
}

export default function EquipmentTable({ data }) {
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const navigate = useNavigate()

  if (!data.length) {
    return <EmptyState title="No equipment matches your filters" description="Try adjusting the search or status filter." />
  }

  const sorted = [...data].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (typeof a[sortKey] === 'string') return a[sortKey].localeCompare(b[sortKey]) * dir
    return (a[sortKey] - b[sortKey]) * dir
  })

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-5 py-2.5 text-left">
                <button
                  onClick={() => toggleSort(col.key)}
                  className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  {col.label}
                  <ArrowUpDown size={11} className={sortKey === col.key ? 'text-primary' : 'text-slate-300'} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((eq) => (
            <tr
              key={eq.id}
              onClick={() => navigate(`/equipment/${eq.id}`)}
              className="border-b border-surface-border last:border-0 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <td className="px-5 py-3 font-mono text-xs text-ink-muted">{eq.id}</td>
              <td className="px-5 py-3 font-medium text-ink whitespace-nowrap">{eq.name}</td>
              <td className="px-5 py-3 text-ink-muted whitespace-nowrap">{eq.line}</td>
              <td className="px-5 py-3">
                <EquipmentStatus status={eq.status} />
              </td>
              <td className="px-5 py-3 tabular-nums text-ink-muted">{eq.utilization}%</td>
              <td className="px-5 py-3 tabular-nums text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Thermometer size={12} />
                  {eq.temperature}°
                </span>
              </td>
              <td className="px-5 py-3 tabular-nums text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Activity size={12} />
                  {eq.vibration}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${healthColor(eq.healthScore)}`} style={{ width: `${eq.healthScore}%` }} />
                  </div>
                  <span className="tabular-nums text-xs text-ink-muted">{eq.healthScore}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
