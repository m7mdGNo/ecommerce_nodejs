const Joi = require('joi')

const orderItemSchema = Joi.object({
  product: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).required(),
})

exports.createOrder = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  shippingAddress: Joi.string().required(),
  paymentType: Joi.string().valid('cod', 'credit').default('cod'),
})

exports.updateOrderStatus = Joi.object({
  status: Joi.string().valid('pending', 'failed', 'canceled', 'paid').required(),
})
