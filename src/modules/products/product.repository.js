const Product = require('./product.model')

class ProductRepository {
  async create(data) {
    return Product.create(data)
  }

  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ])

    return { products, total }
  }

  async findById(id) {
    return Product.findById(id).lean()
  }

  async findOne(filter) {
    return Product.findOne(filter).lean()
  }

  async updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    }).lean()
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id)
  }

  async search(query) {
    return Product.find({ $text: { $search: query } }).lean()
  }
}

module.exports = new ProductRepository()
