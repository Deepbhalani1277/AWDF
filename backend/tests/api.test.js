import request from 'supertest';
import app from '../server.js';

describe('CI/CD Automated API Tests - Practical 12', () => {
  // Test 1: Service Health Check
  test('GET /health returns 200 and ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Test 2: Practical 9 In-Memory Cache Telemetry Endpoint
  test('GET /api/tasks/cache/stats returns 200 and telemetry data', async () => {
    const res = await request(app).get('/api/tasks/cache/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('hits');
  });

  // Test 3: Practical 7 Auth Middleware Security Verification
  test('GET /api/tasks returns 401 Unauthorized when no token is provided', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
