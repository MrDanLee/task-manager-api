# Task Manager API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Production-grade REST API for task management with enterprise security patterns

## 🌐 Live Demo

- **API:** `https://task-api-prod.onrender.com/api/v1`
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
- ✅ Structured error handling
- ✅ Request logging (Winston)
- ✅ Environment-based configuration
- ✅ Graceful shutdown
- ✅ Health check endpoint

## 🚀 Quick Start

\`\`\`bash
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
\`\`\`

## 📚 API Documentation

Interactive documentation is available at `/api-docs` when the server is running.

### Quick Examples

#### Authentication
\`\`\`bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"john@example.com","password":"secure123"}'
\`\`\`

#### Tasks
\`\`\`bash
# Create task
curl -X POST http://localhost:3000/api/v1/tasks \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Complete documentation","priority":"high"}'

# List tasks (with pagination)
curl "http://localhost:3000/api/v1/tasks?page=1&limit=10&status=pending" \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit
- **Logging:** Winston
- **Documentation:** Swagger/OpenAPI 3.0
- **Testing:** Jest + Supertest (coming in delivery 2)

## 📁 Project Structure

\`\`\`
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
├── unit/             # Unit tests (delivery 2)
└── integration/      # Integration tests (delivery 2)
\`\`\`

## 🔐 Environment Variables

\`\`\`env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-min-32-characters
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
CORS_ORIGIN=*
LOG_LEVEL=info
\`\`\`

## 👤 Author

**Daniel Andrés Lozano Meriño**
- GitHub: [@MrDanLee](https://github.com/MrDanLee)
- Email: daniel23lozano@gmail.com
- Portfolio: [mrdanlee.github.io](https://mrdanlee.github.io)

## 📝 License

MIT