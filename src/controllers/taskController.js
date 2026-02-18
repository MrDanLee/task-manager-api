const Task = require('../models/Task');

const getTasks = (req, res, next) => {
  try {
    const tasks = Task.findAll(req.user.id, {
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search
    });

    res.json({ total: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

const getTask = (req, res, next) => {
  try {
    const task = Task.findById(parseInt(req.params.id), req.user.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

const createTask = (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = Task.create({
      userId: req.user.id,
      title,
      description,
      status,
      priority,
      dueDate
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const task = Task.update(parseInt(req.params.id), req.user.id, req.body);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const deleted = Task.delete(parseInt(req.params.id), req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getStats = (req, res, next) => {
  try {
    const stats = Task.getStats(req.user.id);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats };