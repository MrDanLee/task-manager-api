# Architecture Documentation

## Overview

This API follows Clean Architecture principles with a clear separation between layers. Each layer has a specific responsibility and depends only on layers below it.

## Layer Responsibilities

### 1. HTTP Layer (Controllers + Routes)

**Location:** `src/controllers/`, `src/routes/`

**Responsibility:**
- Handle HTTP requests and responses
- Extract data from request
- Call appropriate service methods
- Format HTTP responses
- No business logic

**Example:**
```javascript
// Controller only handles HTTP concerns
const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);
  res.status(201).json({ success: true, data: { task } });
});
```

### 2. Business Logic Layer (Services)

**Location:** `src/services/`

**Responsibility:**
- Implement business rules
- Orchestrate operations
- Handle business validations
- No HTTP knowledge
- No database knowledge

**Example:**
```javascript
// Service contains business logic
async createTask(userId, taskData) {
  logger.info(`Creating task for user ${userId}`);
  const task = await taskRepository.create({ ...taskData, userId });
  logger.info(`Task created: ${task.id}`);
  return task;
}
```

### 3. Data Access Layer (Repositories)

**Location:** `src/repositories/`

**Responsibility:**
- Abstract data persistence
- Handle database queries
- Transform database results
- No business logic
- No HTTP knowledge

**Example:**
```javascript
// Repository handles data access
async create(taskData) {
  return Task.create(taskData);
}

async verifyOwnership(taskId, userId) {
  const task = await this.findById(taskId);
  if (task.userId !== userId) {
    throw createError.forbidden('Access denied');
  }
  return task;
}
```

### 4. Data Layer (Models)

**Location:** `src/models/`

**Responsibility:**
- Define data structure
- Basic data operations
- Data validation rules

## Data Flow
```
Request → Middleware → Controller → Service → Repository → Model → Database
                                       ↓
Response ← Controller ← Service ← Repository ← Model ← Database
```

## Design Patterns Used

### 1. Repository Pattern
Abstracts data access from business logic.

**Benefits:**
- Easy to swap data sources
- Easy to mock for testing
- Single place for data access logic

### 2. Service Layer Pattern
Encapsulates business logic.

**Benefits:**
- Reusable across different interfaces
- Testable without HTTP
- Clear separation of concerns

### 3. Factory Pattern
Used in error creation.
```javascript
const createError = {
  badRequest: (msg) => new ApiError(400, msg),
  unauthorized: (msg) => new ApiError(401, msg)
};
```

### 4. Middleware Pattern
Used for cross-cutting concerns.

**Examples:**
- Authentication
- Rate limiting
- Error handling
- Logging

## Security Considerations

### 1. Authentication Flow
```
Request → Extract token → Verify signature → Load user → Attach to request
```

### 2. Authorization

- Implemented at route level
- Checked in controllers/services
- Ownership verified in repositories

### 3. Input Validation

- Declarative with express-validator
- Applied at route level
- Sanitization included

### 4. Rate Limiting

- IP-based tracking
- Different limits for different endpoints
- Configurable thresholds

## Error Handling Strategy

### 1. Custom Error Class
```javascript
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    // Distinguishes operational vs programming errors
  }
}
```

### 2. Error Flow
```
Error thrown → errorConverter → errorHandler → Response
```

### 3. Operational vs Programming Errors

- **Operational**: Expected errors (validation, not found, etc.)
- **Programming**: Bugs (undefined variable, etc.)

## Testing Strategy

### 1. Unit Tests

**What:** Individual functions/methods  
**Where:** `tests/unit/`  
**Focus:** Logic correctness
```javascript
describe('calculatePagination', () => {
  it('should handle page 0 as page 1', () => {
    const result = calculatePagination(0, 10);
    expect(result.offset).toBe(0);
  });
});
```

### 2. Integration Tests

**What:** Full HTTP request/response cycle  
**Where:** `tests/integration/`  
**Focus:** API behavior
```javascript
describe('POST /api/v1/tasks', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData)
      .expect(201);
  });
});
```

## Scalability Considerations

### Current Implementation
- In-memory storage
- Single process
- No caching

### Production Recommendations

1. **Database**
   - PostgreSQL for relational data
   - Redis for caching/sessions

2. **Horizontal Scaling**
   - Stateless design enables multiple instances
   - Load balancer distributes traffic

3. **Caching Strategy**
   - Redis for frequently accessed data
   - Cache invalidation on updates

4. **Background Jobs**
   - Queue system (Bull, BullMQ)
   - Separate worker processes

5. **Monitoring**
   - Application metrics (response times, error rates)
   - Infrastructure metrics (CPU, memory)
   - Log aggregation (ELK, DataDog)

## Development Workflow

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - `feature/*`: New features
   - `fix/*`: Bug fixes

2. **Commit Convention**
   - Follow Conventional Commits
   - Automated changelog generation

3. **CI/CD Pipeline**
   - Run tests on every push
   - Deploy to staging on develop
   - Deploy to production on main

## Future Enhancements

- [ ] Real database integration (PostgreSQL)
- [ ] Redis caching layer
- [ ] WebSocket support for real-time updates
- [ ] File upload capability
- [ ] Email notifications
- [ ] Background job processing
- [ ] Multi-tenancy support
- [ ] Advanced search with Elasticsearch