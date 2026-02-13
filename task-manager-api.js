// ════════════════════════════════════════════════════════════════
// TASK MANAGER API - VERSIÓN STANDALONE COMPLETA
// Por: Daniel Lozano
// Copia este archivo completo y guárdalo como: server.js
// ════════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'mi_super_secreto_123456';

// ──────────────────────────────────────────────────────────────
// MIDDLEWARES
// ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Base de datos en memoria (para demo sin MySQL)
const users = [];
const tasks = [];
let userId = 1;
let taskId = 1;

// ──────────────────────────────────────────────────────────────
// MIDDLEWARE DE AUTENTICACIÓN
// ──────────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado - Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// ──────────────────────────────────────────────────────────────
// RUTA PRINCIPAL
// ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '✅ Task Manager API funcionando',
    version: '1.0.0',
    author: 'Daniel Lozano',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      }
    },
    ejemplo_uso: {
      '1_registro': {
        url: 'POST /api/auth/register',
        body: {
          name: 'Daniel',
          email: 'daniel@test.com',
          password: '123456'
        }
      },
      '2_login': {
        url: 'POST /api/auth/login',
        body: {
          email: 'daniel@test.com',
          password: '123456'
        },
        nota: 'Copia el token que recibes'
      },
      '3_crear_tarea': {
        url: 'POST /api/tasks',
        headers: {
          Authorization: 'Bearer TU_TOKEN_AQUI'
        },
        body: {
          title: 'Mi primera tarea',
          description: 'Descripción de la tarea',
          priority: 'high'
        }
      }
    }
  });
});

// ──────────────────────────────────────────────────────────────
// AUTENTICACIÓN
// ──────────────────────────────────────────────────────────────

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Verificar si el email ya existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = {
      id: userId++,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Generar token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: '✅ Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: '✅ Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ──────────────────────────────────────────────────────────────
// TAREAS
// ──────────────────────────────────────────────────────────────

// Listar tareas del usuario
app.get('/api/tasks', protect, (req, res) => {
  const { status, priority, search } = req.query;
  
  let userTasks = tasks.filter(t => t.userId === req.userId);
  
  // Filtros
  if (status) {
    userTasks = userTasks.filter(t => t.status === status);
  }
  
  if (priority) {
    userTasks = userTasks.filter(t => t.priority === priority);
  }
  
  if (search) {
    userTasks = userTasks.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Ordenar por fecha de creación (más recientes primero)
  userTasks.sort((a, b) => b.createdAt - a.createdAt);
  
  res.json({
    total: userTasks.length,
    tasks: userTasks
  });
});

// Obtener una tarea específica
app.get('/api/tasks/:id', protect, (req, res) => {
  const task = tasks.find(t => 
    t.id === parseInt(req.params.id) && t.userId === req.userId
  );
  
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  res.json({ task });
});

// Crear tarea
app.post('/api/tasks', protect, (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'El título es requerido' });
  }
  
  const task = {
    id: taskId++,
    userId: req.userId,
    title,
    description: description || '',
    status: 'pending',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(task);
  
  res.status(201).json({
    message: '✅ Tarea creada exitosamente',
    task
  });
});

// Actualizar tarea
app.put('/api/tasks/:id', protect, (req, res) => {
  const taskIndex = tasks.findIndex(t => 
    t.id === parseInt(req.params.id) && t.userId === req.userId
  );
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  const { title, description, status, priority, dueDate } = req.body;
  
  // Actualizar solo los campos proporcionados
  if (title !== undefined) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;
  if (status !== undefined) tasks[taskIndex].status = status;
  if (priority !== undefined) tasks[taskIndex].priority = priority;
  if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
  
  tasks[taskIndex].updatedAt = new Date();
  
  res.json({
    message: '✅ Tarea actualizada',
    task: tasks[taskIndex]
  });
});

// Eliminar tarea
app.delete('/api/tasks/:id', protect, (req, res) => {
  const taskIndex = tasks.findIndex(t => 
    t.id === parseInt(req.params.id) && t.userId === req.userId
  );
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  tasks.splice(taskIndex, 1);
  
  res.json({ message: '✅ Tarea eliminada exitosamente' });
});

// ──────────────────────────────────────────────────────────────
// ESTADÍSTICAS (BONUS)
// ──────────────────────────────────────────────────────────────
app.get('/api/stats', protect, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.userId);
  
  const stats = {
    total: userTasks.length,
    pending: userTasks.filter(t => t.status === 'pending').length,
    in_progress: userTasks.filter(t => t.status === 'in_progress').length,
    completed: userTasks.filter(t => t.status === 'completed').length,
    high_priority: userTasks.filter(t => t.priority === 'high').length,
    medium_priority: userTasks.filter(t => t.priority === 'medium').length,
    low_priority: userTasks.filter(t => t.priority === 'low').length
  };
  
  res.json({ stats });
});

// ──────────────────────────────────────────────────────────────
// INICIAR SERVIDOR
// ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🚀 TASK MANAGER API - By Daniel Lozano');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`  📝 Documentación: http://localhost:${PORT}/`);
  console.log('');
  console.log('  📋 Endpoints disponibles:');
  console.log('     POST   /api/auth/register   - Registrar usuario');
  console.log('     POST   /api/auth/login      - Iniciar sesión');
  console.log('     GET    /api/tasks           - Listar tareas');
  console.log('     POST   /api/tasks           - Crear tarea');
  console.log('     GET    /api/tasks/:id       - Ver tarea');
  console.log('     PUT    /api/tasks/:id       - Actualizar tarea');
  console.log('     DELETE /api/tasks/:id       - Eliminar tarea');
  console.log('     GET    /api/stats           - Estadísticas');
  console.log('');
  console.log('  💡 Tip: Abre http://localhost:3000 para ver la guía');
  console.log('═══════════════════════════════════════════════════════════');
});
