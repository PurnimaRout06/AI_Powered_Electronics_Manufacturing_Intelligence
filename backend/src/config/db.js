import mysql from 'mysql2/promise'
import { env } from './env.js'

// A single shared connection pool used by every route. mysql2's pool
// handles reconnects and concurrency for us — routes just call
// `pool.query(...)` or `pool.execute(...)`.
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: env.db.connectionLimit,
  namedPlaceholders: true,
  dateStrings: true // return DATE/DATETIME columns as strings, not JS Date objects
})

export async function checkDbConnection() {
  const conn = await pool.getConnection()
  try {
    await conn.query('SELECT 1')
    return true
  } finally {
    conn.release()
  }
}
