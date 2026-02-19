const User = require('../models/User');
const { createError } = require('../utils/ApiError');

/**
 * User Repository - Data access layer
 * 
 * Architecture: Repository pattern abstracts data access from business logic.
 * Benefits:
 * - Services don't know about data storage implementation
 * - Easy to mock for testing
 * - Can add caching here without touching business logic
 * - Single place to change if we swap databases
 */

class UserRepository {
  async create(userData) {
    const existingUser = User.findByEmail(userData.email);

    if (existingUser) {
      throw createError.conflict('Email already registered');
    }

    return await User.create(userData);
  }

  async findByEmail(email) {
    return User.findByEmail(email);
  }

  async findById(id) {
    const user = User.findById(id);

    if (!user) {
      throw createError.notFound('User not found');
    }

    return user;
  }

  async verifyCredentials(email, password) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw createError.unauthorized('Invalid credentials');
    }

    const isValid = await User.comparePassword(password, user.password);

    if (!isValid) {
      throw createError.unauthorized('Invalid credentials');
    }

    return user;
  }
}

module.exports = new UserRepository();