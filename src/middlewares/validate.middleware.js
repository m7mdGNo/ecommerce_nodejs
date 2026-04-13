const ApiError = require('../utils/ApiError')

/**
 * Middleware factory that validates request data against a Joi schema.
 * @param {Object} schema - Joi schema with optional body, query, params keys
 */
const validate = (schema) => (req, res, next) => {
  const validationErrors = []

  for (const key of ['params', 'query', 'body']) {
    if (schema[key]) {
      const { error, value } = schema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
      })

      if (error) {
        const messages = error.details.map((detail) => detail.message)
        validationErrors.push(...messages)
      } else {
        req[key] = value // replace with sanitized value
      }
    }
  }

  if (validationErrors.length > 0) {
    return next(ApiError.badRequest('Validation failed', validationErrors))
  }

  next()
}

module.exports = validate
