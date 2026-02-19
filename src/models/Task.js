const db = require('../config/database');

/**
 * Task model
 */

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

  static findAll(filters = {}) {
    let tasks = [...db.tasks];

    if (filters.userId) {
      tasks = tasks.filter(t => t.userId === filters.userId);
    }

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

    // Sort by most recent first
    tasks.sort((a, b) => b.createdAt - a.createdAt);

    return tasks;
  }

  static findById(taskId) {
    return db.tasks.find(t => t.id === taskId);
  }

  static update(taskId, updateData) {
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) return null;

    const task = db.tasks[taskIndex];

    // Only update provided fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        task[key] = updateData[key];
      }
    });

    task.updatedAt = new Date();

    return task;
  }

  static delete(taskId) {
    const index = db.tasks.findIndex(t => t.id === taskId);

    if (index === -1) return false;

    db.tasks.splice(index, 1);
    return true;
  }

  static count(filters = {}) {
    return this.findAll(filters).length;
  }
}

module.exports = Task;