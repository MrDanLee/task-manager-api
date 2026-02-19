const { ApiError } = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Error handling middleware
 * 
 * Architecture: Centralized error handling ensures consistent
 * error responses across the entire API
 * 
 * Two-stage approach:
 * 1. errorConverter: Normalizes all errors to ApiError format
 * 2. errorHandler: Sends formatted response to client
 */

/**
 * Convert non-ApiError errors to ApiError format
 * 
 * Handles:
 * - JWT errors (TokenExpiredError, JsonWebTokenError)
 * - Validation errors (express-validator)
 * - Database errors
 * - Unknown errors
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  // Already an ApiError - pass through
  if (error instanceof ApiError) {
    return next(error);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  } else if (error.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }
  // Validation errors (express-validator)
  else if (error.name === 'ValidationError') {
    error = new ApiError(400, error.message);
  }
  // Generic errors
  else {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, false);
  }

  next(error);
};

/**
 * Final error handler
 * 
 * Security considerations:
 * - Never expose stack traces in production
 * - Log full error details server-side
 * - Send sanitized messages to client
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Log error details
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    // Non-operational errors are programming errors - need investigation
    logger.error('Non-operational error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    });

    // Don't leak error details to client
    statusCode = 500;
    message = 'Internal server error';
  } else {
    // Log operational errors at appropriate level
    logger.warn('Operational error:', {
      statusCode,
      message,
      url: req.originalUrl,
      method: req.method
    });
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  errorConverter,
  errorHandler
};