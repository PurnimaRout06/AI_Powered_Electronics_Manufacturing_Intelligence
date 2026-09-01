// Centralized API client.
//
// Every domain service (manufacturingService, equipmentService, etc.) routes
// its requests through this module. When the Express backend is ready, only
// this file and USE_MOCKS below need to change — no component code depends
// on how data is fetched.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

// Toggle this (or drive it from an env var) once real endpoints exist.
// While true, domain services resolve from local mock data instead of
// hitting the network, but every call still returns a Promise and goes
// through the same shape { data, error }, so swapping this flag is the
// only change needed to go live.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
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
