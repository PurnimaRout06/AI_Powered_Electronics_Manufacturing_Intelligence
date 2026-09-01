import { api, mockResolve, USE_MOCKS } from './api'
import { equipmentList, equipmentTimeSeries, maintenanceHistory } from '../data/mockData'

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
    const params = new URLSearchParams(filters)
    return api.get(`/equipment?${params}`)
  },

  async getById(id) {
    if (USE_MOCKS) {
      const equipment = equipmentList.find((e) => e.id === id)
      if (!equipment) throw new Error('Equipment not found')
      return mockResolve(equipment)
    }
    return api.get(`/equipment/${id}`)
  },

  async getTimeSeries(id) {
    if (USE_MOCKS) return mockResolve(equipmentTimeSeries(id))
    return api.get(`/equipment/${id}/timeseries`)
  },

  async getMaintenanceHistory(id) {
    if (USE_MOCKS) {
      return mockResolve(maintenanceHistory.filter((m) => m.equipment === id))
    }
    return api.get(`/equipment/${id}/maintenance-history`)
  }
}
