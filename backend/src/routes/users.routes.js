import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)

const ALLOWED_THEMES = ['light', 'dark']
const ALLOWED_RANGES = ['today', '7d', '30d']
const ALLOWED_UNITS = ['celsius', 'fahrenheit']

// GET /api/users/preferences
usersRouter.get(
  '/preferences',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT theme, default_date_range, temperature_unit, email_notifications, default_landing_page
       FROM user_preferences WHERE user_id = :userId`,
      { userId: req.user.userId }
    )
    // Every user gets a preferences row created at registration, but fall
    // back to sane defaults just in case (e.g. accounts created before this
    // table existed).
    const prefs = rows[0] || {
      theme: 'light',
      default_date_range: '7d',
      temperature_unit: 'celsius',
      email_notifications: 1,
      default_landing_page: 'overview'
    }
    res.json({
      theme: prefs.theme,
      defaultDateRange: prefs.default_date_range,
      temperatureUnit: prefs.temperature_unit,
      emailNotifications: Boolean(prefs.email_notifications),
      defaultLandingPage: prefs.default_landing_page
    })
  })
)

// PUT /api/users/preferences
usersRouter.put(
  '/preferences',
  asyncHandler(async (req, res) => {
    const { theme, defaultDateRange, temperatureUnit, emailNotifications, defaultLandingPage } = req.body

    if (theme && !ALLOWED_THEMES.includes(theme)) {
      return res.status(400).json({ message: `theme must be one of: ${ALLOWED_THEMES.join(', ')}` })
    }
    if (defaultDateRange && !ALLOWED_RANGES.includes(defaultDateRange)) {
      return res.status(400).json({ message: `defaultDateRange must be one of: ${ALLOWED_RANGES.join(', ')}` })
    }
    if (temperatureUnit && !ALLOWED_UNITS.includes(temperatureUnit)) {
      return res.status(400).json({ message: `temperatureUnit must be one of: ${ALLOWED_UNITS.join(', ')}` })
    }

    await pool.execute(
      `INSERT INTO user_preferences
         (user_id, theme, default_date_range, temperature_unit, email_notifications, default_landing_page)
       VALUES
         (:userId, :theme, :defaultDateRange, :temperatureUnit, :emailNotifications, :defaultLandingPage)
       ON DUPLICATE KEY UPDATE
         theme = VALUES(theme),
         default_date_range = VALUES(default_date_range),
         temperature_unit = VALUES(temperature_unit),
         email_notifications = VALUES(email_notifications),
         default_landing_page = VALUES(default_landing_page)`,
      {
        userId: req.user.userId,
        theme: theme || 'light',
        defaultDateRange: defaultDateRange || '7d',
        temperatureUnit: temperatureUnit || 'celsius',
        emailNotifications: emailNotifications === undefined ? 1 : Number(Boolean(emailNotifications)),
        defaultLandingPage: defaultLandingPage || 'overview'
      }
    )

    res.json({ message: 'Preferences saved.' })
  })
)
