const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware
 * 
 * Security rationale:
 * - Prevents brute force attacks on authentication endpoints
 * - Protects against DoS attacks
 * - Reduces server load from abusive clients
 * 
 * Configuration considerations:
 * - Stricter limits on auth endpoints (credential stuffing protection)
 * - More lenient on general API endpoints
 * - Uses IP-based tracking (works behind proxies with trust proxy enabled)
 */

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in test environment
  skip: (req) => process.env.NODE_ENV === 'test'
});

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

module.exports = { authLimiter, apiLimiter };