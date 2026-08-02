import request from 'supertest';
import app from '../app';

describe('💳 Credit Cards API Protection', () => {
  it('GET /api/v1/cards - should return 401 Unauthorized when no Bearer token is provided', async () => {
    const res = await request(app).get('/api/v1/cards');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/v1/cards/invalid-id/status - should reject unauthenticated card status updates', async () => {
    const res = await request(app)
      .patch('/api/v1/cards/invalid-id/status')
      .send({ status: 'FROZEN' });
    expect(res.status).toBe(401);
  });
});
