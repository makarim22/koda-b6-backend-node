import "dotenv/config"
import pg from 'pg'
const { Pool } = pg

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=disable`

const pool = new Pool({
  connectionString,
})


const query = (text, params) => {
  const start = Date.now()
  return pool.query(text, params).then((res) => {
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  })
}

const getClient = () => {
  return pool.connect()
}

const end = () => {
  return pool.end()
}

export default {
  query,
  getClient,
  end,
}