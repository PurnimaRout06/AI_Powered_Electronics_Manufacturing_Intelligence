import 'dotenv/config'

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`)
  }
  return value
}

export const env = {
  port: Number(process.env.PORT || 4000),

  db: {
    host: required('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT || 3306),
    user: required('DB_USER', 'root'),
    password: required('DB_PASSWORD', ''),
    database: required('DB_NAME', 'electronics_manufacturing_db'),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '12h'
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),

  mlService: {
    url: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    timeoutMs: Number(process.env.ML_SERVICE_TIMEOUT_MS || 5000)
  },

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((s) => s.trim())
}
