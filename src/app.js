const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    version: '1.0.0',
    author: 'Daniel Lozano',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Server error'
  });
});

module.exports = app;