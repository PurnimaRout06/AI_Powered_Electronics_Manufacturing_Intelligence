import { api, mockResolve, USE_MOCKS } from './api'
import {
  maintenanceKpis,
  downtimeTrend,
  downtimeByEquipment,
  downtimeByReason,
  maintenanceTasks
} from '../data/mockData'

export const maintenanceService = {
  async getKpis() {
    if (USE_MOCKS) return mockResolve(maintenanceKpis)
    return api.get('/maintenance/kpis')
  },

  async getDowntimeTrend() {
    if (USE_MOCKS) return mockResolve(downtimeTrend)
    return api.get('/maintenance/downtime-trend')
  },

  async getDowntimeByEquipment() {
    if (USE_MOCKS) return mockResolve(downtimeByEquipment)
    return api.get('/maintenance/downtime-by-equipment')
  },

  async getDowntimeByReason() {
    if (USE_MOCKS) return mockResolve(downtimeByReason)
    return api.get('/maintenance/downtime-by-reason')
  },

  async getTasks() {
    if (USE_MOCKS) return mockResolve(maintenanceTasks)
    return api.get('/maintenance/tasks')
  }
}
