const { authorize } = require('../../../src/middlewares/auth');
const { createError } = require('../../../src/utils/ApiError');

describe('Authorization Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null
    };
    res = {};
    next = jest.fn();
  });

  describe('authorize', () => {
    it('should pass when user has required role', () => {
      req.user = { id: 1, role: 'admin' };
      const middleware = authorize('admin', 'moderator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should pass when user has one of multiple allowed roles', () => {
      req.user = { id: 1, role: 'moderator' };
      const middleware = authorize('admin', 'moderator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should throw unauthorized when user is not authenticated', () => {
      req.user = null;
      const middleware = authorize('admin');

      expect(() => middleware(req, res, next)).toThrow('Not authenticated');
    });

    it('should throw forbidden when user role is not authorized', () => {
      req.user = { id: 1, role: 'user' };
      const middleware = authorize('admin', 'moderator');

      expect(() => middleware(req, res, next)).toThrow(
        "User role 'user' is not authorized to access this route"
      );
    });

    it('should work with single role', () => {
      req.user = { id: 1, role: 'admin' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});