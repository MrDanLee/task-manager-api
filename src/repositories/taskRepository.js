const Task = require('../models/Task');
const { createError } = require('../utils/ApiError');
const { calculatePagination } = require('../utils/pagination');

/**
 * Task Repository - Data access layer
 */

class TaskRepository {
  async create(taskData) {
    return Task.create(taskData);
  }

  async findAll(filters, paginationParams) {
    const { offset, limit } = calculatePagination(
      paginationParams.page,
      paginationParams.limit
    );

    const allTasks = Task.findAll(filters);
    const total = allTasks.length;

    // Apply pagination
    const tasks = allTasks.slice(offset, offset + limit);

    return { tasks, total };
  }

  async findById(taskId) {
    const task = Task.findById(taskId);

    if (!task) {
      throw createError.notFound('Task not found');
    }

    return task;
  }

  async update(taskId, updateData) {
    const task = Task.update(taskId, updateData);

    if (!task) {
      throw createError.notFound('Task not found');
    }

    return task;
  }

  async delete(taskId) {
    const deleted = Task.delete(taskId);

    if (!deleted) {
      throw createError.notFound('Task not found');
    }

    return true;
  }

  /**
   * Verify task ownership
   * Security: Prevents users from accessing/modifying others' tasks
   */
  async verifyOwnership(taskId, userId) {
    const task = await this.findById(taskId);

    if (task.userId !== userId) {
      throw createError.forbidden('Access denied');
    }

    return task;
  }
}

module.exports = new TaskRepository();