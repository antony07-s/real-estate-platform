const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { swaggerUi, swaggerSpec } = require('./utils/swagger')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./modules/auth/auth.routes')
const propertyRoutes = require('./modules/properties/property.routes')
const leadRoutes = require('./modules/leads/lead.routes')

const app = express()

// ─── Security Middlewares ───────────────────────────
// helmet: adds security headers (protects from common attacks)
app.use(helmet())

// cors: allows frontend (localhost:3000) to talk to backend (localhost:5000)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// ─── Rate Limiting ──────────────────────────────────
// Prevents spam — max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

// ─── Body Parser ────────────────────────────────────
// Allows Express to read JSON from request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Swagger Docs ───────────────────────────────────
// API documentation available at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ─── Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/leads', leadRoutes)

// ─── Health Check ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' })
})

// ─── Error Handler ──────────────────────────────────
// Must be LAST — catches all errors from all routes
app.use(errorHandler)

module.exports = app