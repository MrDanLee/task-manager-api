const taskRepository = require('../repositories/taskRepository');
const { formatPaginatedResponse } = require('../utils/pagination');
const logger = require('../config/logger');

/**
 * Task Service - Business logic layer
 * 
 * Responsibilities:
 * - Orchestrate task operations
 * - Apply business rules
 * - Format responses consistently
 */

class TaskService {
  /**
   * Create new task
   * 
   * Business rule: Tasks belong to the user who created them
   */
  async createTask(userId, taskData) {
    logger.info(`Creating task for user ${userId}: ${taskData.title}`);

    const task = await taskRepository.create({
      ...taskData,
      userId
    });

    logger.info(`Task created: ${task.id}`);
    return task;
  }

  /**
   * Get all tasks for a user with filtering and pagination
   * 
   * Performance consideration: Pagination prevents loading
   * thousands of tasks into memory at once
   */
  async getUserTasks(userId, filters, paginationParams) {
    const { tasks, total } = await taskRepository.findAll(
      { ...filters, userId },
      paginationParams
    );

    return formatPaginatedResponse(
      tasks,
      paginationParams.page,
      paginationParams.limit,
      total
    );
  }

  /**
   * Get single task
   * 
   * Security: Verifies ownership before returning
   */
  async getTaskById(taskId, userId) {
    return await taskRepository.verifyOwnership(taskId, userId);
  }

  /**
   * Update task
   * 
   * Design decision: Partial updates allowed (PATCH semantic)
   * Users can update only the fields they want to change
   */
  async updateTask(taskId, userId, updateData) {
    // Verify ownership first
    await taskRepository.verifyOwnership(taskId, userId);

    logger.info(`Updating task ${taskId} for user ${userId}`);

    const task = await taskRepository.update(taskId, updateData);

    logger.info(`Task updated: ${task.id}`);
    return task;
  }

  /**
   * Delete task
   */
  async deleteTask(taskId, userId) {
    // Verify ownership first
    await taskRepository.verifyOwnership(taskId, userId);

    logger.info(`Deleting task ${taskId} for user ${userId}`);

    await taskRepository.delete(taskId);

    logger.info(`Task deleted: ${taskId}`);
    return true;
  }

  /**
   * Get task statistics
   * 
   * Business value: Provides dashboard metrics
   */
  async getStatistics(userId) {
    const allTasks = await taskRepository.findAll({ userId }, { page: 1, limit: 1000 });
    const tasks = allTasks.tasks;

    return {
      total: tasks.length,
      byStatus: {
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
      },
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length
      }
    };
  }
}

module.exports = new TaskService();