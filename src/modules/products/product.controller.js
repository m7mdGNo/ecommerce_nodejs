const productService = require('./product.service')
const asyncHandler = require('../../utils/asyncHandler')
const ApiResponse = require('../../utils/response')
const redisClient = require('../../config/redis')

const clearProductsCache = async () => {
  try {
    const keys = await redisClient.keys('products:*')
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } catch (error) {
    console.error('Redis Cache Deletion Error', error)
  }
}

/**
 * @desc    Create a new product
 * @route   POST /api/products
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body)
  await clearProductsCache()
  ApiResponse.created(res, product, 'Product created successfully')
})

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const cacheKey = `products:${JSON.stringify(req.query)}`
  
  // Try to find cached response
  const cachedData = await redisClient.get(cacheKey)
  if (cachedData) {
    const parsedData = JSON.parse(cachedData)
    return ApiResponse.paginated(res, parsedData.products, parsedData.pagination, 'Products fetched successfully (cached)')
  }

  // Not in cache, fetch from DB
  const { products, pagination } = await productService.getProducts(req.query)
  
  // Cache for 10 minutes (600 seconds)
  await redisClient.set(cacheKey, JSON.stringify({ products, pagination }), 'EX', 600)

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
  await clearProductsCache()
  ApiResponse.success(res, product, 'Product updated successfully')
})

/**
 * @desc    Delete product by ID
 * @route   DELETE /api/products/:id
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id)
  await clearProductsCache()
  ApiResponse.noContent(res)
})
