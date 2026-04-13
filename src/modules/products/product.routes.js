const express = require('express')
const router = express.Router()
const productController = require('./product.controller')
const validate = require('../../middlewares/validate.middleware')
const productValidation = require('./product.validation')
const { protect, authorize } = require('../../middlewares/auth.middleware')

// Public routes
router.get('/', validate(productValidation.getProducts), productController.getProducts)
router.get('/:id', validate(productValidation.getProduct), productController.getProduct)

// Admin only routes
router.post('/', protect, authorize('admin'), validate(productValidation.createProduct), productController.createProduct)
router.put('/:id', protect, authorize('admin'), validate(productValidation.updateProduct), productController.updateProduct)
router.delete('/:id', protect, authorize('admin'), validate(productValidation.deleteProduct), productController.deleteProduct)

module.exports = router
