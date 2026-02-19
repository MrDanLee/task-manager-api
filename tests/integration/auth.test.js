const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('Authentication Endpoints', () => {
  // Clear database before each test
  beforeEach(() => {
    db.users = [];
    db.counters.userId = 1;
  });

  describe('POST /api/v1/auth/register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Registration successful');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toMatchObject({
        name: validUser.name,
        email: validUser.email,
        role: 'user'
      });
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject registration with missing name', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test', email: 'invalid-email', password: 'password123' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject registration with short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: '12345' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject duplicate email registration', async () => {
      // Register first user
      await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      // Try to register with same email
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser)
        .expect(409);

      expect(res.body.message).toContain('already registered');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const userCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          ...userCredentials
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send(userCredentials)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(userCredentials.email);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userCredentials.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should reject login with missing credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(422);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      authToken = res.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(res.body.message).toContain('Not authorized');
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.message).toContain('Invalid token');
    });
  });
});