const Order = require('./order.model')

class OrderRepository {
  async create(orderData) {
    return Order.create(orderData)
  }

  async findById(orderId) {
    return Order.findById(orderId).populate('items.product', 'name price images')
  }

  async findByIdempotencyKeyAndUser(idempotencyKey, userId) {
    return Order.findOne({ idempotencyKey, user: userId })
  }

  async findByUserId(userId, limit = 10, skip = 0) {
    return Order.find({ user: userId })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  }

  async updateStatus(orderId, status) {
    return Order.findByIdAndUpdate(orderId, { status }, { returnDocument: 'after', runValidators: true })
  }
}

module.exports = new OrderRepository()
