const db = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User model - Data structure and basic operations
 * 
 * Note: In a real app with an ORM like Sequelize or Prisma,
 * these methods would be replaced by ORM model methods.
 * This implementation shows the interface you'd work with.
 */

class User {
  static async create(userData) {
    const { name, email, password } = userData;

    // Hash with cost factor of 10 - good security/performance balance
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: db.counters.userId++,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.users.push(user);
    return user;
  }

  static findByEmail(email) {
    return db.users.find(u => u.email === email);
  }

  static findById(id) {
    return db.users.find(u => u.id === id);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Returns user data safe for API responses (no password)
   */
  static toSafeObject(user) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = User;