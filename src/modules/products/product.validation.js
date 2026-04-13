const Joi = require('joi')

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid ObjectId')

const createProduct = {
  body: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    supplier: Joi.string().required(),
    stock: Joi.number().integer().min(0).default(0),
    sku: Joi.string().uppercase().trim(),
    images: Joi.array().items(Joi.string().uri()),
    isActive: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string().trim()),
  }),
}

const updateProduct = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(200),
    description: Joi.string().max(2000),
    price: Joi.number().min(0),
    category: Joi.string(),
    supplier: Joi.string(),
    stock: Joi.number().integer().min(0),
    sku: Joi.string().uppercase().trim(),
    images: Joi.array().items(Joi.string().uri()),
    isActive: Joi.boolean(),
    tags: Joi.array().items(Joi.string().trim()),
  }).min(1), // at least one field required
}

const getProduct = {
  params: Joi.object({
    id: objectId.required(),
  }),
}

const getProducts = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string(),
    supplier: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    search: Joi.string(),
    sortBy: Joi.string().valid('name', 'price', 'createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  }),
}

const deleteProduct = {
  params: Joi.object({
    id: objectId.required(),
  }),
}

module.exports = {
  createProduct,
  updateProduct,
  getProduct,
  getProducts,
  deleteProduct,
}
