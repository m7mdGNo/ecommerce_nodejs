/**
 * Standardized API response helper.
 */
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    })
  }

  static created(res, data, message = 'Created successfully') {
    return res.status(201).json({
      status: 'success',
      message,
      data,
    })
  }

  static noContent(res) {
    return res.status(204).send()
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      status: 'success',
      message,
      data,
      pagination,
    })
  }
}

module.exports = ApiResponse
