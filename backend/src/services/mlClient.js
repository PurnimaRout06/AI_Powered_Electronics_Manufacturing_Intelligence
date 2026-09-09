import { env } from '../config/env.js'

async function callMlService(path, body) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), env.mlService.timeoutMs)

  try {
    const res = await fetch(`${env.mlService.url}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`ML service ${path} returned ${res.status}: ${detail}`)
    }
    return await res.json()
  } finally {
    clearTimeout(timeout)
  }
}

export const mlClient = {
  predictProduction: (features) => callMlService('/predict/production', features),
  predictQualityRejection: (features) => callMlService('/predict/quality-rejection', features),
  predictFailureRisk: (features) => callMlService('/predict/failure-risk', features),
  predictAnomaly: (features) => callMlService('/predict/anomaly', features)
}
