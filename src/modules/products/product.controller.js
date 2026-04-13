const productService = require('./product.service')
const asyncHandler = require('../../utils/asyncHandler')
const ApiResponse = require('../../utils/response')

/**
 * @desc    Create a new product
 * @route   POST /api/products
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body)
  ApiResponse.created(res, product, 'Product created successfully')
})

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getProducts(req.query)
  ApiResponse.paginated(res, products, pagination, 'Products fetched successfully')
})

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 */
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id)
  ApiResponse.success(res, product, 'Product fetched successfully')
})

/**
 * @desc    Update product by ID
 * @route   PUT /api/products/:id
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body)
  ApiResponse.success(res, product, 'Product updated successfully')
})

/**
 * @desc    Delete product by ID
 * @route   DELETE /api/products/:id
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id)
  ApiResponse.noContent(res)
})
