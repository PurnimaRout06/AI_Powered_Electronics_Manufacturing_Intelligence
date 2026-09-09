import { api } from './api'

export const preferencesService = {
  async get() {
    return api.get('/users/preferences')
  },

  async update(preferences) {
    return api.put('/users/preferences', preferences)
  }
}
