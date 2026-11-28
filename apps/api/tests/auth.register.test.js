import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { hashToken, verifyAccessToken } from '../src/lib/tokens.js';
import { testDb } from './helpers.js';

const newCustomer = {
  name: 'Ali Khan',
  email: 'Ali.Khan@Example.com',
  phone: '0300-1234567',
  password: 'carbuyer24',
};

function register(body) {
  return request(createApp()).post('/api/auth/register').send(body);
}

function readRefreshCookie(response) {
  const cookie = response.headers['set-cookie'].find((line) => line.startsWith('refreshToken='));
  return { line: cookie, value: cookie.split(';')[0].split('=')[1] };
}

describe('POST /api/auth/register (FR-AU-01)', () => {
  it('a visitor registers as a customer and gets a working access token', async () => {
    const response = await register(newCustomer);

    expect(response.status).toBe(201);
    expect(response.body.data.user).toMatchObject({ name: 'Ali Khan', role: 'customer' });
    const payload = verifyAccessToken(response.body.data.accessToken);
    expect(payload.userId).toBe(response.body.data.user.id);
    expect(payload.role).toBe('customer');
  });

  it('stores the e-mail in lower case and never the plain password', async () => {
    const user = await testDb('users').where({ email: 'ali.khan@example.com' }).first();

    expect(user).toBeDefined();
    expect(user.passwordHash).not.toContain('carbuyer24');
  });

  it('sets an httpOnly refresh cookie and stores only its hash', async () => {
    const response = await register({ ...newCustomer, email: 'sara@example.com' });
    const cookie = readRefreshCookie(response);

    expect(cookie.line).toContain('HttpOnly');
    expect(cookie.line).toContain('Path=/api/auth');
    const rows = await testDb('refreshTokens').where({ userId: response.body.data.user.id });
    expect(rows).toHaveLength(1);
    expect(rows[0].tokenHash).toBe(hashToken(cookie.value));
    expect(rows[0].tokenHash).not.toBe(cookie.value);
  });

  it('refuses an e-mail that is already used, also in other letter case', async () => {
    const response = await register({ ...newCustomer, email: 'ALI.KHAN@example.com' });

    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe(
      'An account with this e-mail already exists. Log in, or use another e-mail.',
    );
  });

  it('refuses a weak password with a field message', async () => {
    const response = await register({
      ...newCustomer,
      email: 'weak@example.com',
      password: 'short',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.details.password).toBeDefined();
  });

  it('ignores a role sent in the body: the account is always a customer', async () => {
    const response = await register({ ...newCustomer, email: 'boss@example.com', role: 'admin' });

    expect(response.status).toBe(201);
    const user = await testDb('users').where({ email: 'boss@example.com' }).first();
    expect(user.role).toBe('customer');
  });
});
