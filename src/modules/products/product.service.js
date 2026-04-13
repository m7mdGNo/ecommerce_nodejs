const productRepository = require('./product.repository')
const ApiError = require('../../utils/ApiError')
const { buildPagination, paginationMeta } = require('../../utils/helpers')

class ProductService {
  async createProduct(data) {
    return productRepository.create(data)
  }

  async getProducts(query) {
    const { page, limit, skip } = buildPagination(query)

    // Build filter
    const filter = { isActive: true }

    if (query.category) {
      filter.category = query.category
    }

    if (query.minPrice || query.maxPrice) {
      filter.price = {}
      if (query.minPrice) filter.price.$gte = Number(query.minPrice)
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice)
    }

    if (query.search) {
      filter.$text = { $search: query.search }
    }

    // Build sort
    let sort = { createdAt: -1 }
    if (query.sortBy) {
      const order = query.order === 'asc' ? 1 : -1
      sort = { [query.sortBy]: order }
    }

    const { products, total } = await productRepository.findAll(filter, {
      skip,
      limit,
      sort,
    })

    return {
      products,
      pagination: paginationMeta(total, page, limit),
    }
  }

  async getProductById(id) {
    const product = await productRepository.findById(id)

    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    return product
  }

  async updateProduct(id, data) {
    const product = await productRepository.updateById(id, data)

    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    return product
  }

  async deleteProduct(id) {
    const product = await productRepository.deleteById(id)

    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    return product
  }
}

module.exports = new ProductService()
