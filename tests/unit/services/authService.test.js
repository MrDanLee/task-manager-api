const authService = require('../../../src/services/authService');
const jwt = require('jsonwebtoken');

describe('AuthService', () => {
  describe('verifyToken', () => {
    const validToken = authService.generateToken(1);

    it('should verify valid token', () => {
      const decoded = authService.verifyToken(validToken);

      expect(decoded.id).toBe(1);
    });

    it('should throw error for expired token', () => {
      // Create expired token
      const expiredToken = jwt.sign(
        { id: 1 },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure expiration
      setTimeout(() => {
        expect(() => {
          authService.verifyToken(expiredToken);
        }).toThrow('Token expired');
      }, 100);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        authService.verifyToken(invalidToken);
      }).toThrow('Invalid token');
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        authService.verifyToken('malformed-token');
      }).toThrow('Invalid token');
    });
  });

  describe('generateToken', () => {
    it('should generate valid token', () => {
      const token = authService.generateToken(123);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(123);
    });
  });
});