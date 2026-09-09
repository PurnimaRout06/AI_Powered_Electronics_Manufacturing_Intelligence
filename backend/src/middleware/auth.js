import { verifyToken } from '../utils/jwt.js'

// Requires a valid `Authorization: Bearer <token>` header. Attaches the
// decoded payload ({ userId, email, role }) to req.user for downstream
// handlers.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header.' })
  }

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' })
  }
}
