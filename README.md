# 📝 Task Manager API

Complete REST API for task management with JWT authentication and role-based access control.

## 🚀 Features

- ✅ JWT authentication with roles (admin/user)
- ✅ Full CRUD operations for tasks
- ✅ Filters, pagination, and search
- ✅ Route protection with middleware
- ✅ Password hashing with bcrypt
- ✅ Data validation

## 🛠️ Technologies

- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcrypt

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/MrDanLee/task-manager-api.git
cd task-manager-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start the server
```bash
npm run dev
```

Server will run at `http://localhost:3000`

## 🔗 Endpoints

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Daniel Lozano",
  "email": "daniel@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "daniel@example.com",
  "password": "password123"
}
```

**Get profile**
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Tasks

**List tasks** (with filters and pagination)
```http
GET /api/tasks?status=pending&priority=high
Authorization: Bearer {token}
```

**Create task**
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task API",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

**Get task**
```http
GET /api/tasks/:id
Authorization: Bearer {token}
```

**Update task**
```http
PUT /api/tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

**Delete task**
```http
DELETE /api/tasks/:id
Authorization: Bearer {token}
```

**Get statistics**
```http
GET /api/tasks/stats
Authorization: Bearer {token}
```

## 🧪 Testing with Postman

1. Register a user with `/api/auth/register`
2. Login with `/api/auth/login`
3. Copy the received token
4. Use it in the header `Authorization: Bearer {token}`

## 👤 Author

Daniel Andrés Lozano Meriño
- GitHub: [@MrDanLee](https://github.com/MrDanLee)
- Email: daniel23lozano@gmail.com
- Portfolio: [mrdanlee.github.io](https://mrdanlee.github.io)

## 📝 License

MIT