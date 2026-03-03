# Task Manager API

[![CI/CD](https://github.com/MrDanLee/task-manager-api/actions/workflows/ci.yml/badge.svg)](https://github.com/MrDanLee/task-manager-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

> Production-grade REST API for task management with enterprise security patterns

## 🌐 Live Demo

- **API:** `https://task-manager-api-8jb5.onrender.com`
- **Documentation:** `https://task-api-prod.onrender.com/api-docs`
- **Health:** `https://task-api-prod.onrender.com/health`

## 🏗️ Architecture

This API follows **Clean Architecture** principles with clear separation of concerns:
```
┌─────────────────┐
│   HTTP Layer    │  Controllers (handle requests/responses)
└────────┬────────┘
         │
┌────────▼────────┐
│ Business Logic  │  Services (orchestrate operations)
└────────┬────────┘
         │
┌────────▼────────┐
│  Data Access    │  Repositories (abstract persistence)
└────────┬────────┘
         │
┌────────▼────────┐
│   Data Store    │  Models (structure data)
└─────────────────┘
```

### Why This Structure?

- **Testability**: Each layer can be unit tested independently
- **Maintainability**: Business logic separate from HTTP concerns
- **Flexibility**: Easy to swap data sources (in-memory → PostgreSQL → MongoDB)
- **Professional Standard**: Industry best practice for Node.js APIs

## ✨ Features

### Core Functionality
- ✅ User authentication with JWT
- ✅ Complete task CRUD operations
- ✅ Advanced filtering (status, priority, search)
- ✅ Pagination with metadata
- ✅ Task ownership validation
- ✅ Statistics endpoint

### Security
- ✅ Helmet.js security headers
- ✅ Rate limiting (5 req/15min auth, 100 req/15min API)
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Password hashing (bcrypt cost 10)

### Developer Experience
- ✅ OpenAPI/Swagger documentation
- ✅ Comprehensive test suite (unit + integration)
- ✅ CI/CD with GitHub Actions
- ✅ 98%+ test coverage
- ✅ Structured error handling
- ✅ Request logging (Winston)
- ✅ ESLint code quality
- ✅ Environment-based configuration

## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/MrDanLee/task-manager-api.git
cd task-manager-api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Visit documentation
open http://localhost:3000/api-docs
```

## 🧪 Testing
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current coverage (as of latest commit):

- **Statements**: 98%+
- **Branches**: 89%+
- **Functions**: 98%+
- **Lines**: 98%+

## 📚 API Documentation

Interactive documentation is available at `/api-docs` when the server is running.

### Quick Examples

#### Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

#### Tasks
```bash
# Create task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete documentation","priority":"high"}'

# List tasks (with pagination and filters)
curl "http://localhost:3000/api/v1/tasks?page=1&limit=10&status=pending&priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get statistics
curl http://localhost:3000/api/v1/tasks/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Testing:** Jest + Supertest
- **Security:** Helmet, express-rate-limit
- **Logging:** Winston
- **Documentation:** Swagger/OpenAPI 3.0
- **CI/CD:** GitHub Actions

## 📁 Project Structure
```
src/
├── config/           # Configuration (logger, swagger)
├── controllers/      # HTTP request handlers
├── services/         # Business logic layer
├── repositories/     # Data access layer
├── models/           # Data models
├── routes/           # Route definitions
├── middlewares/      # Custom middleware
├── validators/       # Input validation
├── utils/            # Helper functions
└── app.js            # Express app setup

tests/
├── setup.js          # Test configuration
├── unit/             # Unit tests
│   └── utils/        # Utility function tests
└── integration/      # Integration tests
    ├── auth.test.js  # Authentication tests
    └── tasks.test.js # Task endpoint tests
```

## 🔐 Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-min-32-characters
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

## 🚢 Deployment

### Render.com

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy command: `npm start`
4. Build command: `npm install`

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Considerations

- **Rate Limiting**: Prevents abuse and DDoS
- **Input Validation**: Reduces malformed requests
- **Pagination**: Limits database queries
- **Logging**: Async with appropriate levels
- **Error Handling**: Prevents memory leaks
- **Graceful Shutdown**: Closes connections properly

## 🤝 Contributing

This is a portfolio project, but feedback is welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Daniel Andrés Lozano Meriño**

- GitHub: [@MrDanLee](https://github.com/MrDanLee)
- Email: daniel23lozano@gmail.com

## 🙏 Acknowledgments

- The Bridge School for foundational training
- Node.js and Express.js communities
- Open source contributors

---

**Built with ❤️ and Node.js**