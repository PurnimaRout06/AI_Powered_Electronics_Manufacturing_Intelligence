import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret)
}
