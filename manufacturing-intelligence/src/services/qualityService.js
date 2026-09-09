import { api, mockResolve, USE_MOCKS } from './api'
import { qualityKpis, defectsOverTime, defectsByType, qualityByLine, defectRecords } from '../data/mockData'

export const qualityService = {
  async getKpis() {
    if (USE_MOCKS) return mockResolve(qualityKpis)
    return api.get('/quality/kpis')
  },

  async getDefectsOverTime() {
    if (USE_MOCKS) return mockResolve(defectsOverTime)
    return api.get('/quality/defects-over-time')
  },

  async getDefectsByType() {
    if (USE_MOCKS) return mockResolve(defectsByType)
    return api.get('/quality/defects-by-type')
  },

  async getQualityByLine() {
    if (USE_MOCKS) return mockResolve(qualityByLine)
    return api.get('/quality/by-line')
  },

  async getDefectRecords() {
    if (USE_MOCKS) return mockResolve(defectRecords)
    return api.get('/quality/defect-records')
  }
}
