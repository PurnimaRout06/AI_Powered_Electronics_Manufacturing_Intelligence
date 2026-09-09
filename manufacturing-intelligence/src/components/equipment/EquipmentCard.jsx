import { useNavigate } from 'react-router-dom'
import { Thermometer, Activity, Gauge } from 'lucide-react'
import Card from '../ui/Card'
import EquipmentStatus from './EquipmentStatus'

export default function EquipmentCard({ equipment }) {
  const navigate = useNavigate()

  return (
    <Card hover className="cursor-pointer" onClick={() => navigate(`/equipment/${equipment.id}`)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-ink-muted">{equipment.id}</p>
          <p className="text-sm font-semibold text-ink mt-0.5">{equipment.name}</p>
          <p className="text-xs text-ink-muted mt-0.5">{equipment.line}</p>
        </div>
        <EquipmentStatus status={equipment.status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-surface-bg py-2">
          <Gauge size={13} className="mx-auto text-ink-muted mb-1" />
          <p className="text-xs font-semibold tabular-nums text-ink">{equipment.utilization}%</p>
        </div>
        <div className="rounded-lg bg-surface-bg py-2">
          <Thermometer size={13} className="mx-auto text-ink-muted mb-1" />
          <p className="text-xs font-semibold tabular-nums text-ink">{equipment.temperature}°</p>
        </div>
        <div className="rounded-lg bg-surface-bg py-2">
          <Activity size={13} className="mx-auto text-ink-muted mb-1" />
          <p className="text-xs font-semibold tabular-nums text-ink">{equipment.vibration}</p>
        </div>
      </div>
    </Card>
  )
}
