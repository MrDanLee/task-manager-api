const { validationResult } = require('express-validator');
const { createError } = require('../utils/ApiError');

/**
 * Validation middleware
 * 
 * Checks for validation errors from express-validator
 * and returns them in a consistent format
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    const error = createError.unprocessable('Validation failed');
    error.errors = errorMessages;

    throw error;
  }

  next();
};

module.exports = validate;