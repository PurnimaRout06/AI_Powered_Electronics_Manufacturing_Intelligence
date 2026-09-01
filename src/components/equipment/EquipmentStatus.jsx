import Badge from '../ui/Badge'

const LABELS = {
  running: 'Running',
  idle: 'Idle',
  warning: 'Warning',
  maintenance: 'Maintenance',
  critical: 'Critical'
}

export default function EquipmentStatus({ status }) {
  return (
    <Badge status={status} dot>
      {LABELS[status] || status}
    </Badge>
  )
}
