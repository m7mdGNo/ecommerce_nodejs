/**
 * Build a pagination object from query params.
 */
const buildPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

/**
 * Build pagination meta for response.
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
})

/**
 * Pick specific fields from an object.
 */
const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

module.exports = {
  buildPagination,
  paginationMeta,
  pick,
}
