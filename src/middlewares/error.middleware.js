const logger = require('../config/logger')
const ApiError = require('../utils/ApiError')

/**
 * Global error handling middleware.
 * Catches all errors and returns a standardized JSON response.
 */
const errorMiddleware = (err, req, res, next) => {
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    err = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ')
    err = ApiError.conflict(`Duplicate value for field: ${field}`)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    err = ApiError.badRequest('Validation failed', errors)
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  logger.error(`${statusCode} - ${message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack,
  })

  res.status(statusCode).json({
    status: err.status || 'error',
    message,
    ...(err.errors?.length && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorMiddleware
