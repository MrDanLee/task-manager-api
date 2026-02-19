const taskService = require('../services/taskService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Task Controller - HTTP request handlers
 */

/**
 * @desc    Create new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task }
  });
});

/**
 * @desc    Get all tasks for current user
 * @route   GET /api/v1/tasks
 * @access  Private
 * 
 * Query params: page, limit, status, priority, search
 */
const getTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (search) filters.search = search;

  const result = await taskService.getUserTasks(
    req.user.id,
    filters,
    { page, limit }
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(
    parseInt(req.params.id),
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: { task }
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(
    parseInt(req.params.id),
    req.user.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task }
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(
    parseInt(req.params.id),
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get task statistics
 * @route   GET /api/v1/tasks/stats
 * @access  Private
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await taskService.getStatistics(req.user.id);

  res.status(200).json({
    success: true,
    data: { stats }
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getStats
};