const { errorConverter, errorHandler } = require('../../../src/middlewares/errorHandler');
const { ApiError } = require('../../../src/utils/ApiError');

describe('Error Handling Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/test',
      method: 'GET'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Silence console in tests
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('errorConverter', () => {
    it('should pass through ApiError unchanged', () => {
      const error = new ApiError(400, 'Bad request');

      errorConverter(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should convert JsonWebTokenError to 401', () => {
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';

      errorConverter(error, req, res, next);

      const convertedError = next.mock.calls[0][0];
      expect(convertedError.statusCode).toBe(401);
      expect(convertedError.message).toBe('Invalid token');
    });

    it('should convert TokenExpiredError to 401', () => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';

      errorConverter(error, req, res, next);

      const convertedError = next.mock.calls[0][0];
      expect(convertedError.statusCode).toBe(401);
      expect(convertedError.message).toBe('Token expired');
    });

    it('should convert ValidationError to 400', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';

      errorConverter(error, req, res, next);

      const convertedError = next.mock.calls[0][0];
      expect(convertedError.statusCode).toBe(400);
    });

    it('should convert generic error to 500', () => {
      const error = new Error('Something went wrong');

      errorConverter(error, req, res, next);

      const convertedError = next.mock.calls[0][0];
      expect(convertedError.statusCode).toBe(500);
      expect(convertedError.isOperational).toBe(false);
    });
  });

  describe('errorHandler', () => {
    it('should send error response with correct status and message', () => {
      const error = new ApiError(400, 'Bad request');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        message: 'Bad request'
      });
    });

    it('should include validation errors if present', () => {
      const error = new ApiError(422, 'Validation failed');
      error.errors = [{ field: 'email', message: 'Invalid email' }];

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 422,
        message: 'Validation failed',
        errors: [{ field: 'email', message: 'Invalid email' }]
      });
    });

    it('should hide non-operational errors in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new ApiError(500, 'Database connection failed', false);

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        message: 'Internal server error'
      });

      process.env.NODE_ENV = 'test';
    });

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new ApiError(500, 'Server error');

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.stack).toBeDefined();

      process.env.NODE_ENV = 'test';
    });
  });
});