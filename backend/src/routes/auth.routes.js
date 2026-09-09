import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'
import { env } from '../config/env.js'
import { signToken } from '../utils/jwt.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const authRouter = Router()

// POST /api/auth/register
// Creates a new user account and an empty preferences row, then returns a
// JWT so the frontend can log the person straight in.
authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are all required.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    const [existing] = await pool.execute('SELECT user_id FROM users WHERE email = :email', { email })
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with that email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds)

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :passwordHash)',
      { name, email, passwordHash }
    )
    const userId = result.insertId

    // Create a default preferences row up front so GET /users/preferences
    // never has to special-case "no row yet".
    await pool.execute('INSERT INTO user_preferences (user_id) VALUES (:userId)', { userId })

    const token = signToken({ userId, email, role: 'viewer' })
    res.status(201).json({
      token,
      user: { id: userId, name, email, role: 'viewer' }
    })
  })
)

// POST /api/auth/login
authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' })
    }

    const [rows] = await pool.execute(
      'SELECT user_id, name, email, password_hash, role FROM users WHERE email = :email',
      { email }
    )
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken({ userId: user.user_id, email: user.email, role: user.role })
    res.json({
      token,
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role }
    })
  })
)

// GET /api/auth/me — returns the current user, used on app load to
// restore a session from a stored token.
authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      'SELECT user_id, name, email, role FROM users WHERE user_id = :userId',
      { userId: req.user.userId }
    )
    const user = rows[0]
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    res.json({ id: user.user_id, name: user.name, email: user.email, role: user.role })
  })
)
