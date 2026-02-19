const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const logger = require('./config/logger');
const { errorConverter, errorHandler } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { createError } = require('./utils/ApiError');

const app = express();

/**
 * Express app configuration
 * 
 * Middleware order matters:
 * 1. Security (helmet, cors)
 * 2. Logging
 * 3. Body parsing
 * 4. Rate limiting
 * 5. Routes
 * 6. 404 handler
 * 7. Error handling
 */

// Trust proxy - important for rate limiting behind reverse proxies (Heroku, Render, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Request logging - skip in test environment
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// Body parsing with size limits to prevent payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting on all API routes
app.use('/api/', apiLimiter);

/**
 * Health check endpoint
 * Used by monitoring tools and load balancers
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * API documentation
 * Available at /api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Manager API - Documentation',
}));

/**
 * API routes - versioned for future compatibility
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

/**
 * 404 handler - must come after all valid routes
 */
app.use((req, res, next) => {
  next(createError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

/**
 * Error handling middleware - must be last
 */
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;