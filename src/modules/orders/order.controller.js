const orderService = require('./order.service')
const ApiResponse = require('../../utils/response')
const asyncHandler = require('../../utils/asyncHandler')

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body)
  ApiResponse.created(res, order, 'Order created successfully')
})

exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id, req.query)
  ApiResponse.success(res, orders, 'Orders retrieved successfully')
})

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role)
  ApiResponse.success(res, order, 'Order retrieved successfully')
})

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status)
  ApiResponse.success(res, order, 'Order status updated successfully')
})
