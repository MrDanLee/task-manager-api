const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('Task Endpoints', () => {
  let authToken;
  let userId;

  // Setup: Register user and get token before each test
  beforeEach(async () => {
    // Clear database
    db.users = [];
    db.tasks = [];
    db.counters.userId = 1;
    db.counters.taskId = 1;

    // Register and login
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = res.body.data.token;
    userId = res.body.data.user.id;
  });

  describe('POST /api/v1/tasks', () => {
    const validTask = {
      title: 'Test Task',
      description: 'Test description',
      priority: 'high',
      status: 'pending'
    };

    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validTask)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.task).toMatchObject({
        title: validTask.title,
        description: validTask.description,
        priority: validTask.priority,
        status: validTask.status,
        userId
      });
      expect(res.body.data.task.id).toBeDefined();
    });

    it('should reject task creation without authentication', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .send(validTask)
        .expect(401);
    });

    it('should reject task with missing title', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No title' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject task with invalid priority', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...validTask, priority: 'invalid' })
        .expect(422);
    });

    it('should create task with defaults for optional fields', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Minimal Task' })
        .expect(201);

      expect(res.body.data.task.status).toBe('pending');
      expect(res.body.data.task.priority).toBe('medium');
    });
  });

  describe('GET /api/v1/tasks', () => {
    beforeEach(async () => {
      // Create multiple tasks for testing
      const tasks = [
        { title: 'Task 1', priority: 'high', status: 'pending' },
        { title: 'Task 2', priority: 'low', status: 'completed' },
        { title: 'Task 3', priority: 'medium', status: 'in_progress' }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(task);
      }
    });

    it('should get all user tasks', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 3
      });
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?status=completed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('completed');
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].priority).toBe('high');
    });

    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination.hasMore).toBe(true);
    });

    it('should search tasks by title', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?search=Task 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toContain('Task 1');
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task' });

      taskId = res.body.data.task.id;
    });

    it('should get task by id', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.task.id).toBe(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .get('/api/v1/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Original Task', status: 'pending' });

      taskId = res.body.data.task.id;
    });

    it('should update task', async () => {
      const res = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed', title: 'Updated Task' })
        .expect(200);

      expect(res.body.data.task.status).toBe('completed');
      expect(res.body.data.task.title).toBe('Updated Task');
    });

    it('should allow partial updates', async () => {
      const res = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(res.body.data.task.status).toBe('completed');
      expect(res.body.data.task.title).toBe('Original Task');
    });

    it('should reject update with invalid data', async () => {
      await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' })
        .expect(422);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Task to Delete' });

      taskId = res.body.data.task.id;
    });

    it('should delete task', async () => {
      await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify task is deleted
      await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app)
        .delete('/api/v1/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /api/v1/tasks/stats', () => {
    beforeEach(async () => {
      const tasks = [
        { title: 'Task 1', priority: 'high', status: 'pending' },
        { title: 'Task 2', priority: 'high', status: 'completed' },
        { title: 'Task 3', priority: 'low', status: 'in_progress' },
        { title: 'Task 4', priority: 'medium', status: 'completed' }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(task);
      }
    });

    it('should return task statistics', async () => {
      const res = await request(app)
        .get('/api/v1/tasks/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.stats).toMatchObject({
        total: 4,
        byStatus: {
          pending: 1,
          in_progress: 1,
          completed: 2
        },
        byPriority: {
          low: 1,
          medium: 1,
          high: 2
        }
      });
    });
  });
});