const orderService = require('./order.service')
const sendResponse = require('../../utils/response')
const asyncHandler = require('../../utils/asyncHandler')

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body)
  sendResponse(res, 201, 'Order created successfully', order)
})

exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id, req.query)
  sendResponse(res, 200, 'Orders retrieved successfully', orders)
})

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role)
  sendResponse(res, 200, 'Order retrieved successfully', order)
})

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status)
  sendResponse(res, 200, 'Order status updated successfully', order)
})
