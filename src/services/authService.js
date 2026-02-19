const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const User = require('../models/User');
const logger = require('../config/logger');

/**
 * Authentication Service - Business logic layer
 * 
 * Architecture note: Services contain business logic and orchestrate
 * between repositories. They don't know about HTTP (req/res).
 * 
 * Why separate from controllers:
 * - Testable without HTTP mocking
 * - Reusable across different interfaces (REST, GraphQL, CLI)
 * - Business rules in one place
 */

class AuthService {
  /**
   * Generate JWT token
   * 
   * Security consideration: Token payload is minimal to reduce token size
   * and avoid leaking sensitive data if token is intercepted
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }

  /**
  * Verify and decode JWT token
  */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const err = new Error('Token expired');
        err.name = 'TokenExpiredError';
        throw err;
      }
      const err = new Error('Invalid token');
      err.name = 'JsonWebTokenError';
      throw err;
    }
  }

  /**
   * Register new user
   * 
   * Business rules:
   * - Email must be unique (enforced by repository)
   * - Password must be hashed (done by User model)
   * - Return token immediately (auto-login after registration)
   */
  async register(userData) {
    logger.info(`Registration attempt for email: ${userData.email}`);

    const user = await userRepository.create(userData);
    const token = this.generateToken(user.id);

    logger.info(`User registered successfully: ${user.id}`);

    return {
      token,
      user: User.toSafeObject(user)
    };
  }

  /**
   * Login existing user
   * 
   * Security: Uses constant-time comparison for password
   * to prevent timing attacks (handled by bcrypt.compare)
   */
  async login(email, password) {
    logger.info(`Login attempt for email: ${email}`);

    const user = await userRepository.verifyCredentials(email, password);
    const token = this.generateToken(user.id);

    logger.info(`User logged in successfully: ${user.id}`);

    return {
      token,
      user: User.toSafeObject(user)
    };
  }

  /**
   * Get current user by token
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    return User.toSafeObject(user);
  }
}

module.exports = new AuthService();