import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { assertBranchAccess } from '../src/lib/assertBranchAccess.js';
import { signAccessToken } from '../src/lib/tokens.js';
import { authenticate, requireRole } from '../src/middleware/authenticate.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

// A small app with one staff-only route, wired like the real routes will be.
function createTestApp() {
  const app = express();
  app.get('/staff-only', authenticate, requireRole('sales_staff', 'branch_manager'), (req, res) =>
    res.json({ data: req.user }),
  );
  app.use(errorHandler);
  return app;
}

function bearer(user) {
  return `Bearer ${signAccessToken(user)}`;
}

describe('authenticate and requireRole (FR-AU-06)', () => {
  it('no token gives 401', async () => {
    const response = await request(createTestApp()).get('/staff-only');

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe('You need to log in first.');
  });

  it('a changed or made-up token gives 401', async () => {
    const response = await request(createTestApp())
      .get('/staff-only')
      .set('Authorization', 'Bearer not.a.token');

    expect(response.status).toBe(401);
  });

  it('a customer on a staff route gives 403', async () => {
    const customer = { id: 1, role: 'customer', branchId: null };

    const response = await request(createTestApp())
      .get('/staff-only')
      .set('Authorization', bearer(customer));

    expect(response.status).toBe(403);
    expect(response.body.error.message).toBe('This page is not for your account.');
  });

  it('staff with a valid token pass, and the route sees who they are', async () => {
    const staff = { id: 4, role: 'sales_staff', branchId: 2 };

    const response = await request(createTestApp())
      .get('/staff-only')
      .set('Authorization', bearer(staff));

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ id: 4, role: 'sales_staff', branchId: 2 });
  });
});

describe('assertBranchAccess (FR-AU-07)', () => {
  it('staff of branch 2 on a branch 1 record get 403', () => {
    const staffOfBranch2 = { id: 4, role: 'sales_staff', branchId: 2 };

    expect(() => assertBranchAccess(staffOfBranch2, 1)).toThrow(
      expect.objectContaining({ statusCode: 403 }),
    );
  });

  it('staff and managers pass for their own branch', () => {
    expect(() => assertBranchAccess({ id: 3, role: 'sales_staff', branchId: 1 }, 1)).not.toThrow();
    expect(() =>
      assertBranchAccess({ id: 2, role: 'branch_manager', branchId: 1 }, 1),
    ).not.toThrow();
  });

  it('an admin passes for any branch', () => {
    expect(() => assertBranchAccess({ id: 1, role: 'admin', branchId: null }, 3)).not.toThrow();
  });

  it('a customer is refused: branch records are for staff', () => {
    expect(() => assertBranchAccess({ id: 5, role: 'customer', branchId: null }, 1)).toThrow(
      expect.objectContaining({ statusCode: 403 }),
    );
  });
});

describe('rate limit on the auth routes (NFR-SC-06)', () => {
  it('the 21st login request in the window gives 429', async () => {
    const app = createApp();
    // An empty form fails validation at once, so these 20 requests are quick.
    for (let attempt = 1; attempt <= 20; attempt += 1) {
      expect((await request(app).post('/api/auth/login').send({})).status).toBe(400);
    }

    const response = await request(app).post('/api/auth/login').send({});

    expect(response.status).toBe(429);
    expect(response.body.error.message).toBe(
      'Too many attempts from this address. Try again in 15 minutes.',
    );
  });
});

describe('security headers and CORS', () => {
  it('helmet sets its headers and CORS allows only the web address', async () => {
    const response = await request(createApp())
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('another web address is not allowed', async () => {
    const response = await request(createApp())
      .get('/api/health')
      .set('Origin', 'https://evil.example.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
