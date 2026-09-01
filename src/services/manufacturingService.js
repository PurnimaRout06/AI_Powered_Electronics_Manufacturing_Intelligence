import { api, mockResolve, USE_MOCKS } from './api'
import { kpis, aiInsights } from '../data/mockData'

export const manufacturingService = {
  async getOverviewKpis(range = '7d') {
    if (USE_MOCKS) return mockResolve({ ...kpis, range })
    return api.get(`/manufacturing/kpis?range=${range}`)
  },

  async getAiInsights() {
    if (USE_MOCKS) return mockResolve(aiInsights)
    return api.get('/manufacturing/ai-insights')
  }
}
