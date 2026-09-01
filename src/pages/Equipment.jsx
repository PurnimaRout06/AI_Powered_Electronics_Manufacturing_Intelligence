import { useState } from 'react'
import { Search, LayoutGrid, List as ListIcon } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Dropdown from '../components/ui/Dropdown'
import EquipmentTable from '../components/equipment/EquipmentTable'
import EquipmentCard from '../components/equipment/EquipmentCard'
import { ChartSkeleton, ErrorState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { equipmentService } from '../services/equipmentService'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'running', label: 'Running' },
  { value: 'idle', label: 'Idle' },
  { value: 'warning', label: 'Warning' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'critical', label: 'Critical' }
]

export default function Equipment() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [view, setView] = useState('table')

  const { data, loading, error, refetch } = useAsync(
    () => equipmentService.list({ search, status }),
    [search, status]
  )

  return (
    <DashboardLayout title="Equipment" breadcrumb="Manufacturing / Equipment">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">Equipment</h2>
        <p className="text-sm text-ink-muted mt-1">Monitor equipment health, utilization and operating status.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 h-9 flex-1 min-w-[220px] rounded-lg border border-surface-border bg-white px-3 text-sm focus-within:border-primary transition-colors">
          <Search size={15} className="text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment by name or ID..."
            className="flex-1 bg-transparent outline-none placeholder:text-ink-muted"
          />
        </div>
        <Dropdown options={STATUS_OPTIONS} value={status} onChange={setStatus} label="Status" />
        <div className="flex items-center rounded-lg border border-surface-border bg-white p-0.5">
          <button
            onClick={() => setView('table')}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${view === 'table' ? 'bg-primary-lighter text-primary' : 'text-ink-muted'}`}
          >
            <ListIcon size={15} />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${view === 'grid' ? 'bg-primary-lighter text-primary' : 'text-ink-muted'}`}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {loading && <ChartSkeleton heightClass="h-96" />}
      {error && (
        <Card>
          <ErrorState onRetry={refetch} />
        </Card>
      )}
      {data &&
        (view === 'table' ? (
          <Card>
            <EquipmentTable data={data} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((eq) => (
              <EquipmentCard key={eq.id} equipment={eq} />
            ))}
          </div>
        ))}
    </DashboardLayout>
  )
}
