require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 3000;

/**
 * Start server
 * 
 * Best practices:
 * - Graceful startup logging
 * - Environment validation
 * - Separate app.js from server.js for testing
 */

// Validate critical environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Start server
const server = app.listen(PORT, () => {
  logger.info('╔═══════════════════════════════════════════════════════════╗');
  logger.info('║       TASK MANAGER API - By Daniel Lozano                ║');
  logger.info('╚═══════════════════════════════════════════════════════════╝');
  logger.info('');
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info('');
  logger.info('Available endpoints:');
  logger.info('  POST   /api/v1/auth/register');
  logger.info('  POST   /api/v1/auth/login');
  logger.info('  GET    /api/v1/auth/me');
  logger.info('  GET    /api/v1/tasks');
  logger.info('  POST   /api/v1/tasks');
  logger.info('  GET    /api/v1/tasks/:id');
  logger.info('  PUT    /api/v1/tasks/:id');
  logger.info('  DELETE /api/v1/tasks/:id');
  logger.info('  GET    /api/v1/tasks/stats');
  logger.info('');
});

/**
 * Graceful shutdown
 * Properly closes connections before exiting
 */
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server gracefully...');

  server.close(() => {
    logger.info('Server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Unhandled rejection handler
 * Logs error and exits gracefully
 */
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  gracefulShutdown();
});