// Centralized API client.
//
// Every domain service (manufacturingService, equipmentService, etc.) routes
// its requests through this module. When the Express backend is ready, only
// this file and USE_MOCKS below need to change — no component code depends
// on how data is fetched.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

// Now that the Node/Express backend exists (see /backend), USE_MOCKS
// defaults to false — every domain service below hits the real API. Flip
// VITE_USE_MOCKS=true in the frontend's .env to fall back to local mock
// data (e.g. to run the UI standalone without the backend/database/ML
// service running).
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

const AUTH_TOKEN_KEY = 'mi_auth_token'

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token)
  else localStorage.removeItem(AUTH_TOKEN_KEY)
}

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const token = getAuthToken()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined,
    signal
  })

  let payload = null
  try {
    payload = await res.json()
  } catch {
    // no body / not JSON
  }

  if (res.status === 401) {
    // Token missing/expired — clear it so the next render redirects to login.
    setAuthToken(null)
  }

  if (!res.ok) {
    throw new ApiError(payload?.message || res.statusText, res.status, payload)
  }

  return payload
}

// Simulates network latency + the { data, error } contract real calls will use,
// so components never need to change when mocks are swapped for HTTP calls.
function mockResolve(data, { delay = 350, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) {
        reject(new ApiError('Mock request failed', 500))
      } else {
        resolve(data)
      }
    }, delay)
  })
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' })
}

export { ApiError, mockResolve, API_BASE_URL }
