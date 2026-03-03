const taskRepository = require('../../../src/repositories/taskRepository');
const Task = require('../../../src/models/Task');
const db = require('../../../src/config/database');

describe('TaskRepository', () => {
  beforeEach(() => {
    db.tasks = [];
    db.counters.taskId = 1;
  });

  describe('verifyOwnership', () => {
    it('should return task if user is owner', async () => {
      const task = Task.create({
        userId: 1,
        title: 'Test Task'
      });

      const result = await taskRepository.verifyOwnership(task.id, 1);

      expect(result.id).toBe(task.id);
      expect(result.userId).toBe(1);
    });

    it('should throw forbidden error if user is not owner', async () => {
      const task = Task.create({
        userId: 1,
        title: 'Test Task'
      });

      await expect(
        taskRepository.verifyOwnership(task.id, 2)
      ).rejects.toThrow('Access denied');
    });

    it('should throw not found error for non-existent task', async () => {
      await expect(
        taskRepository.verifyOwnership(9999, 1)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('findById', () => {
    it('should throw not found error for non-existent task', async () => {
      await expect(
        taskRepository.findById(9999)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('update', () => {
    it('should throw not found error for non-existent task', async () => {
      await expect(
        taskRepository.update(9999, { title: 'Updated' })
      ).rejects.toThrow('Task not found');
    });
  });

  describe('delete', () => {
    it('should throw not found error for non-existent task', async () => {
      await expect(
        taskRepository.delete(9999)
      ).rejects.toThrow('Task not found');
    });
  });
});