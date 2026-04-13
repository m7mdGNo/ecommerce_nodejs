const authRepository = require('./auth.repository')
const { generateToken } = require('../../services/jwt.service')
const ApiError = require('../../utils/ApiError')

class AuthService {
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email)
    if (existingUser) {
      throw ApiError.conflict('Email already registered')
    }

    const user = await authRepository.createUser({ name, email, password })
    const token = generateToken(user._id, user.role)

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }
  }

  async login({ email, password }) {
    // Find user with password
    const user = await authRepository.findByEmail(email)
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    const token = generateToken(user._id, user.role)

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }
  }

  async getMe(userId) {
    const user = await authRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('User not found')
    }
    return user
  }
}

module.exports = new AuthService()
