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

  // Test 4: Practical 13 AI Endpoint Input Validation
  test('POST /api/ai/generate-description returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test 5: Practical 13 AI Endpoint Generation & Graceful Fallback
  test('POST /api/ai/generate-description returns valid description and disclaimer', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Implement Automated Unit Testing' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('description');
    expect(res.body.description.length).toBeGreaterThan(10);
    expect(res.body).toHaveProperty('disclaimer');
  });
});

