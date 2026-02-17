const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: db.counters.userId++,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
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

  static getPublicData(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}

module.exports = User;