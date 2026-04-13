const authService = require('./auth.service')
const asyncHandler = require('../../utils/asyncHandler')
const ApiResponse = require('../../utils/response')

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body)
  ApiResponse.created(res, result, 'User registered successfully')
})

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body)
  ApiResponse.success(res, result, 'Login successful')
})

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id)
  ApiResponse.success(res, user, 'User profile fetched')
})
