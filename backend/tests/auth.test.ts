import request from 'supertest';
import { app } from '../src/app';
import { createTestCustomer, prisma } from './helpers';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'Test@123456',
        name: 'New User',
        cpf: '123.456.789-00',
        phone: '11999999999',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        email: 'duplicate@test.com',
        password: 'Test@123456',
        name: 'User 1',
        cpf: '123.456.789-01',
      };

      // Primeiro registro
      await request(app).post('/api/v1/auth/register').send(userData);

      // Segundo registro com mesmo email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          cpf: '123.456.789-02', // CPF diferente
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test@123456',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@test.com',
          password: '123',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration without required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@test.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const { user } = await createTestCustomer();

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'Test@123456',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Test@123456',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with invalid password', async () => {
      const { user } = await createTestCustomer();

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login without required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const { refreshToken } = await createTestCustomer();

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.refreshToken).not.toBe(refreshToken); // Novo refresh token
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject expired refresh token', async () => {
      const { refreshToken } = await createTestCustomer();

      // Deletar o refresh token do banco para simular token expirado/invalidado
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout user with valid refresh token', async () => {
      const { accessToken, refreshToken } = await createTestCustomer();

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verificar se o refresh token foi removido do banco
      const tokenExists = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      expect(tokenExists).toBeNull();
    });

    it('should reject logout without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken: 'some-token' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get user profile with valid token', async () => {
      const { user, accessToken } = await createTestCustomer();

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.email).toBe(user.email);
      expect(response.body.name).toBe(user.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/auth/me', () => {
    it('should update user profile with valid data', async () => {
      const { user, accessToken } = await createTestCustomer();

      const updateData = {
        name: 'Updated Name',
        phone: '11888888888',
      };

      const response = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.phone).toBe(updateData.phone);
      expect(response.body.email).toBe(user.email); // Email não muda
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put('/api/v1/auth/me')
        .send({ name: 'New Name' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/auth/password', () => {
    it('should change password with valid current password', async () => {
      const { accessToken } = await createTestCustomer();

      const response = await request(app)
        .put('/api/v1/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'Test@123456',
          newPassword: 'NewTest@123456',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject password change with wrong current password', async () => {
      const { accessToken } = await createTestCustomer();

      const response = await request(app)
        .put('/api/v1/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123',
          newPassword: 'NewTest@123456',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject weak new password', async () => {
      const { accessToken } = await createTestCustomer();

      const response = await request(app)
        .put('/api/v1/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'Test@123456',
          newPassword: '123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject password change without authentication', async () => {
      const response = await request(app)
        .put('/api/v1/auth/password')
        .send({
          currentPassword: 'Test@123456',
          newPassword: 'NewTest@123456',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
