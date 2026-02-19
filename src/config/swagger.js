const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger/OpenAPI configuration
 * 
 * Design decision: Documentation lives with code (in route files)
 * using JSDoc comments. This keeps docs synchronized with implementation.
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '2.0.0',
      description: 'Production-grade REST API for task management with JWT authentication',
      contact: {
        name: 'Daniel Lozano',
        email: 'daniel23lozano@gmail.com',
        url: 'https://mrdanlee.github.io'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://task-manager-api-8jb5.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            statusCode: {
              type: 'integer',
              example: 400
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);