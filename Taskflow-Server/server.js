import 'dotenv/config'
import express   from 'express'
import cors      from 'cors'
import helmet    from 'helmet'
import morgan    from 'morgan'

import projectRoutes from './routes/projects.js'
import taskRoutes    from './routes/tasks.js'

const app  = express()
const PORT = process.env.PORT || 4000

// ── Middleware ──────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── Routes ──────────────────────────────────────────────────
app.use('/api/projects', projectRoutes)
app.use('/api/tasks',    taskRoutes)

// ── 404 ─────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`🚀  TaskFlow API running on port ${PORT}`))