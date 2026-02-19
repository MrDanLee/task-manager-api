const { ApiError, createError } = require('../../../src/utils/ApiError');

describe('ApiError', () => {
  describe('Constructor', () => {
    it('should create an ApiError with all properties', () => {
      const error = new ApiError(404, 'Not found', true, 'custom stack');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.isOperational).toBe(true);
      expect(error.stack).toBe('custom stack');
    });

    it('should capture stack trace when not provided', () => {
      const error = new ApiError(500, 'Internal error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ApiError');
    });

    it('should default isOperational to true', () => {
      const error = new ApiError(400, 'Bad request');

      expect(error.isOperational).toBe(true);
    });
  });

  describe('Factory methods', () => {
    it('should create badRequest error', () => {
      const error = createError.badRequest('Invalid input');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
    });

    it('should create unauthorized error', () => {
      const error = createError.unauthorized();

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });

    it('should create forbidden error', () => {
      const error = createError.forbidden('No access');

      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('No access');
    });

    it('should create notFound error', () => {
      const error = createError.notFound();

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should create conflict error', () => {
      const error = createError.conflict('Already exists');

      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Already exists');
    });

    it('should create internal error as non-operational', () => {
      const error = createError.internal('Server error');

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Server error');
      expect(error.isOperational).toBe(false);
    });
  });
});