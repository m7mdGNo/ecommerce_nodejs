const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const errorMiddleware = require('./middlewares/error.middleware')
const authRoutes = require('./modules/auth/auth.routes')
const productRoutes = require('./modules/products/product.routes')

const app = express()

// --- Global Middlewares ---
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { status: 'fail', message: 'Too many requests, please try again later' },
})
app.use('/api', limiter)

// --- Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'API is working' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} not found` })
})

// --- Error Middleware (must be last) ---
app.use(errorMiddleware)

module.exports = app