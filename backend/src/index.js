import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { checkDbConnection } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.routes.js'
import { usersRouter } from './routes/users.routes.js'
import { machinesRouter } from './routes/machines.routes.js'
import { productionRouter } from './routes/production.routes.js'
import { qualityRouter } from './routes/quality.routes.js'
import { maintenanceRouter } from './routes/maintenance.routes.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { aiRouter } from './routes/ai.routes.js'

const app = express()

app.use(cors({ origin: env.corsOrigins }))
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await checkDbConnection()
    res.json({ status: 'ok', database: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: err.message })
  }
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/machines', machinesRouter)
app.use('/api/production', productionRouter)
app.use('/api/quality', qualityRouter)
app.use('/api/maintenance', maintenanceRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/ai', aiRouter)

app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`[backend] listening on http://localhost:${env.port}`)
})
