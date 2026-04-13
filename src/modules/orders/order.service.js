const orderRepository = require('./order.repository')
const productRepository = require('../products/product.repository')
const ApiError = require('../../utils/ApiError')

class OrderService {
  async createOrder(userId, idempotencyKey, { items, shippingAddress, paymentType }) {
    if (idempotencyKey) {
        const existingOrder = await orderRepository.findByIdempotencyKeyAndUser(idempotencyKey, userId)
        if (existingOrder) {
            return { order: existingOrder, isNew: false }
        }
    }

    if (!items || items.length === 0) {
      throw ApiError.badRequest('Order items cannot be empty')
    }

    let totalPrice = 0
    const processedItems = []
    const reservedItems = []

    try {
      for (const item of items) {
        // Attempt atomic deduction
        const product = await productRepository.decrementStockAtomically(item.product, item.quantity)
        
        if (!product) {
          // If null, it means either product DNE or stock is < quantity
          const existingProduct = await productRepository.findById(item.product)
          if (!existingProduct) throw ApiError.notFound(`Product not found: ${item.product}`)
          throw ApiError.badRequest(`Insufficient stock for product: ${existingProduct.name}`)
        }

        reservedItems.push({ productId: product._id, quantity: item.quantity })
        totalPrice += product.price * item.quantity

        processedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price // Snapshot price at time of order
        })
      }

      let status = 'pending'
      if (paymentType === 'cod') {
          status = 'pending'
      }

      const orderData = {
        user: userId,
        items: processedItems,
        shippingAddress,
        paymentType,
        status,
        totalPrice,
        idempotencyKey
      }

      const order = await orderRepository.create(orderData)
      return { order, isNew: true }

    } catch (error) {
      // Rollback reserved stock if ANY failure occurs during deduction or order creation
      for (const resItem of reservedItems) {
        await productRepository.incrementStockAtomically(resItem.productId, resItem.quantity)
      }
      
      throw error // Surface the original error to the controller
    }
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
