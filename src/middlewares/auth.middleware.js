const { verifyToken } = require('../services/jwt.service')
const User = require('../modules/users/user.model')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Protect routes — requires a valid JWT in the Authorization header.
 * Attaches the user object to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized, no token provided')
  }

  try {
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id)

    if (!user) {
      throw ApiError.unauthorized('User belonging to this token no longer exists')
    }

    req.user = { id: user._id, role: user.role }
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token')
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired')
    }
    throw error
  }
})

/**
 * Restrict routes to specific roles.
 * Usage: authorize('admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('You do not have permission to perform this action')
    }
    next()
  }
}

module.exports = { protect, authorize }
