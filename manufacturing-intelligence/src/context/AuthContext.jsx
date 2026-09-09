import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService'
import { getAuthToken, setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // "loading" covers the initial session-restore check on app load, so
  // ProtectedRoute doesn't flash a redirect to /login before we know
  // whether a stored token is still valid.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const token = getAuthToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch {
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = useCallback(async (email, password) => {
    const loggedInUser = await authService.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (name, email, password) => {
    const newUser = await authService.register(name, email, password)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
