const orderRepository = require('./order.repository')
const productRepository = require('../products/product.repository')
const ApiError = require('../../utils/ApiError')

class OrderService {
  async createOrder(userId, { items, shippingAddress, paymentType }) {
    if (!items || items.length === 0) {
      throw ApiError.badRequest('Order items cannot be empty')
    }

    let totalPrice = 0
    const processedItems = []

    // Verify products, generate total, and capture snapshot price
    for (const item of items) {
      const product = await productRepository.findById(item.product)
      if (!product) {
        throw ApiError.notFound(`Product not found: ${item.product}`)
      }
      
      // Basic stock validation (assuming simple deduction logic later or cod)
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for product: ${product.name}`)
      }

      totalPrice += product.price * item.quantity
      
      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price // Snapshot price at time of order
      })
    }

    // Determine initial status based on payment type
    let status = 'pending'
    if (paymentType === 'cod') {
        // Cash on delivery could arguably be pending until collected, but for this context it's standard processing/pending.
        status = 'pending'
    }

    const orderData = {
      user: userId,
      items: processedItems,
      shippingAddress,
      paymentType,
      status,
      totalPrice,
    }

    const order = await orderRepository.create(orderData)

    // Automatically deduct stock 
    for (const item of processedItems) {
        const product = await productRepository.findById(item.product)
        if (product) {
            await productRepository.updateById(product._id, { stock: product.stock - item.quantity })
        }
    }

    return order
  }

  async getUserOrders(userId, queryOptions = {}) {
    const page = parseInt(queryOptions.page, 10) || 1
    const limit = parseInt(queryOptions.limit, 10) || 10
    const skip = (page - 1) * limit
    return orderRepository.findByUserId(userId, limit, skip)
  }

  async getOrderById(orderId, userId, userRole) {
    const order = await orderRepository.findById(orderId)
    if (!order) {
      throw ApiError.notFound('Order not found')
    }

    // Ensure authorized visibility
    if (userRole !== 'admin' && order.user.toString() !== userId.toString()) {
      throw ApiError.forbidden('Not authorized to access this order')
    }

    return order
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'failed', 'canceled', 'paid']
    if (!validStatuses.includes(status)) {
        throw ApiError.badRequest('Invalid order status')
    }
    
    const order = await orderRepository.updateStatus(orderId, status)
    if (!order) {
      throw ApiError.notFound('Order not found')
    }
    return order
  }
}

module.exports = new OrderService()
