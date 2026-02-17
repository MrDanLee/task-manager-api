const db = require('../config/database');

class Task {
  static create(taskData) {
    const task = {
      id: db.counters.taskId++,
      userId: taskData.userId,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.tasks.push(task);
    return task;
  }

  static findAll(userId, filters = {}) {
    let tasks = db.tasks.filter(t => t.userId === userId);

    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    tasks.sort((a, b) => b.createdAt - a.createdAt);
    return tasks;
  }

  static findById(taskId, userId) {
    return db.tasks.find(t => t.id === taskId && t.userId === userId);
  }

  static update(taskId, userId, updateData) {
    const task = this.findById(taskId, userId);

    if (!task) return null;

    if (updateData.title !== undefined) task.title = updateData.title;
    if (updateData.description !== undefined) task.description = updateData.description;
    if (updateData.status !== undefined) task.status = updateData.status;
    if (updateData.priority !== undefined) task.priority = updateData.priority;
    if (updateData.dueDate !== undefined) task.dueDate = updateData.dueDate;

    task.updatedAt = new Date();
    return task;
  }

  static delete(taskId, userId) {
    const index = db.tasks.findIndex(t => t.id === taskId && t.userId === userId);
    if (index === -1) return false;
    db.tasks.splice(index, 1);
    return true;
  }

  static getStats(userId) {
    const tasks = db.tasks.filter(t => t.userId === userId);
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      high_priority: tasks.filter(t => t.priority === 'high').length
    };
  }
}

module.exports = Task;