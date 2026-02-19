const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');
const { createError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Authentication middleware
 * 
 * Security flow:
 * 1. Extract token from Authorization header
 * 2. Verify token signature and expiration
 * 3. Load user from database
 * 4. Attach user to request object
 * 
 * Why verify user exists: Token might be valid but user could be
 * deleted/deactivated. Always check current state.
 */

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw createError.unauthorized('Not authorized to access this route');
  }

  // Verify token
  const decoded = authService.verifyToken(token);

  // Load current user
  const user = await userRepository.findById(decoded.id);

  // Attach to request for use in controllers
  req.user = user;

  next();
});

/**
 * Role-based authorization middleware
 * 
 * Usage: authorize('admin', 'moderator')
 * 
 * Design: Flexible authorization that accepts multiple roles.
 * Returns a middleware function (closure pattern)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw createError.unauthorized('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw createError.forbidden(
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};

module.exports = { protect, authorize };