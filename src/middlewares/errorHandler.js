const { ApiError } = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Convert non-ApiError errors to ApiError format
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (error instanceof ApiError) {
    return next(error);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  } else if (error.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }
  // Validation errors
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
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Log error details
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    logger.error('Non-operational error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    });

    statusCode = 500;
    message = 'Internal server error';
  } else if (process.env.NODE_ENV !== 'test') {
    logger.warn('Operational error:', {
      statusCode,
      message,
      url: req.originalUrl,
      method: req.method
    });
  }

  // Always return consistent format
  const response = {
    success: false,
    statusCode,
    message
  };

  // Include validation errors if present
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler
};