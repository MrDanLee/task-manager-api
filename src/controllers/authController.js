const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Authentication Controller - HTTP request handlers
 * 
 * Responsibility: Handle HTTP concerns only
 * - Extract data from request
 * - Call appropriate service methods
 * - Format HTTP response
 * 
 * Pattern: Thin controllers, fat services
 * Business logic stays in services for testability
 */

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.register({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: { user }
  });
});

module.exports = {
  register,
  login,
  getMe
};