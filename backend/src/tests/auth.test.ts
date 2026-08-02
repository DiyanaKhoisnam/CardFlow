import request from 'supertest';
import app from '../app';

describe('🔒 Authentication & System APIs', () => {
  it('GET /api/v1/health - should return 200 OK and system status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('timestamp');
  });

  it('POST /api/v1/auth/login - should return non-200 status on invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'WrongPassword123!' });
    
    expect([400, 401, 500]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register - should fail when password does not meet Zod constraints', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'invalid-pass@example.com',
        password: '123', // Too short
        firstName: 'Test',
        lastName: 'User',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
