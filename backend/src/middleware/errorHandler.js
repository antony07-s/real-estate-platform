const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  } else {
    console.error('Error:', err.message)
  }

  // Default error
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  if (statusCode >= 500 && process.env.NODE_ENV !== 'development') {
    message = 'Internal Server Error'
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    // Unique constraint violation (e.g. email already exists)
    statusCode = 409
    message = 'Resource already exists'
  }

  if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400
    message = 'Referenced resource does not exist'
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // Joi validation errors
  if (err.isJoi) {
    statusCode = 400
    message = err.details[0].message
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler
