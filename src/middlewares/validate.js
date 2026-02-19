const { validationResult } = require('express-validator');
const { createError } = require('../utils/ApiError');

/**
 * Validation middleware
 * 
 * Checks for validation errors from express-validator
 * and returns them in a consistent format
 * 
 * Usage: router.post('/endpoint', validationSchema, validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    throw createError.unprocessable('Validation failed', {
      errors: errorMessages
    });
  }

  next();
};

module.exports = validate;