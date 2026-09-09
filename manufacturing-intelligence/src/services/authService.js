import { api, setAuthToken } from './api'

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    setAuthToken(data.token)
    return data.user
  },

  async register(name, email, password) {
    const data = await api.post('/auth/register', { name, email, password })
    setAuthToken(data.token)
    return data.user
  },

  async getCurrentUser() {
    return api.get('/auth/me')
  },

  logout() {
    setAuthToken(null)
  }
}
