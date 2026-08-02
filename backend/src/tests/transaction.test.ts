import request from 'supertest';
import app from '../app';

describe('🧾 Transactions Ledger API Protection', () => {
  it('GET /api/v1/transactions - should return 401 Unauthorized without JWT token', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/transactions/analytics - should protect spending analytics endpoint', async () => {
    const res = await request(app).get('/api/v1/transactions/analytics');
    expect(res.status).toBe(401);
  });
});
