# 📝 Task Manager API

API REST completa para gestión de tareas con autenticación JWT y roles de usuario.

## 🚀 Características

- ✅ Autenticación JWT con roles (admin/usuario)
- ✅ CRUD completo de tareas
- ✅ Filtros, paginación y búsqueda
- ✅ Protección de rutas con middleware
- ✅ Hashing de contraseñas con bcrypt
- ✅ Validación de datos

## 🛠️ Tecnologías

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcrypt

## 📦 Instalación

1. Clona el repositorio
```bash
git clone https://github.com/MrDanLee/task-manager-api.git
cd task-manager-api
```

2. Instala dependencias
```bash
npm install
```

3. Configura variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales de MySQL
```

4. Crea la base de datos
```sql
CREATE DATABASE task_manager;
```

5. Inicia el servidor
```bash
npm run dev
```

El servidor correrá en `http://localhost:3000`

## 🔗 Endpoints

### Autenticación

**Registro**
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

**Obtener perfil**
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Tareas

**Listar tareas** (con filtros y paginación)
```http
GET /api/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer {token}
```

**Crear tarea**
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Terminar proyecto",
  "description": "Finalizar API de tareas",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

**Obtener tarea**
```http
GET /api/tasks/:id
Authorization: Bearer {token}
```

**Actualizar tarea**
```http
PUT /api/tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

**Eliminar tarea**
```http
DELETE /api/tasks/:id
Authorization: Bearer {token}
```

## 🧪 Probar con Postman

1. Importa la colección (próximamente)
2. Crea un usuario con `/api/auth/register`
3. Haz login con `/api/auth/login`
4. Copia el token recibido
5. Úsalo en el header `Authorization: Bearer {token}`

## 👤 Autor

Daniel Andrés Lozano Meriño
- GitHub: [@MrDanLee](https://github.com/MrDanLee)
- Email: daniel23lozano@gmail.com

## 📝 Licencia

MIT