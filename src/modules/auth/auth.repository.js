const User = require('../users/user.model')

class AuthRepository {
  async createUser(data) {
    return User.create(data)
  }

  async findByEmail(email) {
    return User.findOne({ email }).select('+password')
  }

  async findById(id) {
    return User.findById(id)
  }
}

module.exports = new AuthRepository()
