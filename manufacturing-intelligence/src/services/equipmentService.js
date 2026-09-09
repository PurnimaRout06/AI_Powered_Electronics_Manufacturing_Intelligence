import { api, mockResolve, USE_MOCKS } from './api'
import { equipmentList, equipmentTimeSeries, maintenanceHistory } from '../data/mockData'

// Equipment IDs are displayed as "EQ-004" but the backend's `machines`
// table uses a plain numeric machine_id. This extracts that number from
// either form so routes like /equipment/EQ-004 keep working.
function toMachineId(id) {
  const match = String(id).match(/\d+/)
  return match ? Number(match[0]) : id
}

export const equipmentService = {
  async list(filters = {}) {
    if (USE_MOCKS) {
      let results = equipmentList
      if (filters.status && filters.status !== 'all') {
        results = results.filter((e) => e.status === filters.status)
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        results = results.filter(
          (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
        )
      }
      return mockResolve(results)
    }
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''))
    )
    return api.get(`/machines?${params}`)
  },

  async getById(id) {
    if (USE_MOCKS) {
      const equipment = equipmentList.find((e) => e.id === id)
      if (!equipment) throw new Error('Equipment not found')
      return mockResolve(equipment)
    }
    const machineId = toMachineId(id)
    // The list endpoint already computes utilization/temperature/vibration/
    // healthScore in the exact shape the UI needs, so fetch through it
    // rather than duplicating that computation here.
    const list = await api.get('/machines')
    const found = list.find((e) => e.machineId === machineId)
    if (found) return found

    const machine = await api.get(`/machines/${machineId}`)
    return {
      id: `EQ-${String(machineId).padStart(3, '0')}`,
      machineId,
      name: machine.machine_name,
      line: machine.location,
      status: (machine.status || '').toLowerCase(),
      utilization: 0,
      temperature: 0,
      vibration: 0,
      lastMaintenance: null,
      healthScore: 0
    }
  },

  async getTimeSeries(id) {
    if (USE_MOCKS) return mockResolve(equipmentTimeSeries(id))
    const machineId = toMachineId(id)
    return api.get(`/machines/${machineId}/timeseries`)
  },

  async getMaintenanceHistory(id) {
    if (USE_MOCKS) {
      return mockResolve(maintenanceHistory.filter((m) => m.equipment === id))
    }
    const machineId = toMachineId(id)
    return api.get(`/machines/${machineId}/maintenance-history`)
  }
}
