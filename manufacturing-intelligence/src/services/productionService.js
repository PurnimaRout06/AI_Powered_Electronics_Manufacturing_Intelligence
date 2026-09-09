import { api, mockResolve, USE_MOCKS } from './api'
import { productionSeries, productionByLine, productionStatus } from '../data/mockData'

export const productionService = {
  async getOutputSeries(days = 14) {
    if (USE_MOCKS) return mockResolve(productionSeries)
    return api.get(`/production/output?days=${days}`)
  },

  async getByLine() {
    if (USE_MOCKS) return mockResolve(productionByLine)
    return api.get('/production/by-line')
  },

  async getStatusSummary() {
    if (USE_MOCKS) return mockResolve(productionStatus)
    return api.get('/production/status')
  }
}
