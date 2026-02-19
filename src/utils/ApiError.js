/**
 * Custom error class for standardized API error responses
 * 
 * Why: Centralizes error handling logic and ensures consistent
 * error format across the entire API. The 'isOperational' flag
 * helps distinguish between programming errors (bugs) and
 * operational errors (invalid input, network issues, etc.)
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Factory methods for common HTTP errors
 * 
 * Pattern: Factory pattern keeps error creation consistent
 * and reduces boilerplate throughout the codebase
 */
const createError = {
  badRequest: (msg = 'Bad request') => new ApiError(400, msg),
  unauthorized: (msg = 'Unauthorized') => new ApiError(401, msg),
  forbidden: (msg = 'Forbidden') => new ApiError(403, msg),
  notFound: (msg = 'Resource not found') => new ApiError(404, msg),
  conflict: (msg = 'Conflict') => new ApiError(409, msg),
  unprocessable: (msg = 'Unprocessable entity') => new ApiError(422, msg),
  tooManyRequests: (msg = 'Too many requests') => new ApiError(429, msg),
  internal: (msg = 'Internal server error') => new ApiError(500, msg, false),
};

module.exports = { ApiError, createError };