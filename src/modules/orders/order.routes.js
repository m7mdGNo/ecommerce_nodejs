const express = require('express')
const router = express.Router()
const orderController = require('./order.controller')
const validate = require('../../middlewares/validate.middleware')
const orderValidation = require('./order.validation')
const { protect, authorize } = require('../../middlewares/auth.middleware')

// Require authenticated user for all order routes
router.use(protect)

// User routes
router.post('/', validate(orderValidation.createOrder), orderController.createOrder)
router.get('/', orderController.getUserOrders)
router.get('/:id', orderController.getOrder)

// Admin routes
router.patch(
  '/:id/status',
  authorize('admin'),
  validate(orderValidation.updateOrderStatus),
  orderController.updateOrderStatus
)

module.exports = router
