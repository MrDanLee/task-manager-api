/**
 * Test setup and global configuration
 * 
 * Runs before all tests to configure the test environment
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-minimum-32-characters';
process.env.JWT_EXPIRE = '1h';
process.env.LOG_LEVEL = 'error'; // Only log errors in tests

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging test failures
  error: console.error,
};