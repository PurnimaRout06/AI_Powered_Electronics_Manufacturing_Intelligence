import { api, mockResolve, USE_MOCKS } from './api'
import { productionSeries, productionByLine, productionStatus } from '../data/mockData'

export const productionService = {
  async getOutputSeries(range = '14d') {
    if (USE_MOCKS) return mockResolve(productionSeries)
    return api.get(`/production/output?range=${range}`)
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
