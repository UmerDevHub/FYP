import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { logInUser } from '../src/modules/auth/auth.service.js';
import { verifyAccessToken } from '../src/lib/tokens.js';
import { logInAs, makeBranch, makeUser, TEST_PASSWORD, testDb } from './helpers.js';

const WRONG_LOGIN = 'The e-mail or password is not right.';
const MINUTE = 60 * 1000;

function logIn(email, password) {
  return request(createApp()).post('/api/auth/login').send({ email, password });
}

describe('POST /api/auth/login (FR-AU-02)', () => {
  it('a user with the right e-mail and password gets a token and the refresh cookie', async () => {
    const user = await makeUser('customer');

    const response = await logIn(user.email.toUpperCase(), TEST_PASSWORD);

    expect(response.status).toBe(200);
    expect(verifyAccessToken(response.body.data.accessToken).userId).toBe(user.id);
    expect(response.headers['set-cookie'].join(';')).toContain('refreshToken=');
    expect(response.body.data.user).not.toHaveProperty('passwordHash');
  });

  it('a wrong password and an unknown e-mail get the same answer', async () => {
    const user = await makeUser('customer');

    const wrongPassword = await logIn(user.email, 'not-the-password1');
    const unknownEmail = await logIn('nobody@vehicle360.test', TEST_PASSWORD);

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
    expect(wrongPassword.body.error.message).toBe(WRONG_LOGIN);
  });

  it('an inactive account gets the same general message, even with the right password', async () => {
    const user = await makeUser('customer');
    await testDb('users').where({ id: user.id }).update({ isActive: false });

    const response = await logIn(user.email, TEST_PASSWORD);

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe(WRONG_LOGIN);
  });

  it('an unknown e-mail still checks a password, so it takes about as long as a real one', async () => {
    const start = performance.now();
    await expect(logInUser({ email: 'nobody@vehicle360.test', password: 'x' })).rejects.toThrow();

    // bcrypt with cost 12 takes well over 50 ms; an answer without a password check takes about 1 ms.
    expect(performance.now() - start).toBeGreaterThan(50);
  });
});

describe('the lock after five failed logins (A-18)', () => {
  async function failLogins(user, count, now) {
    for (let attempt = 0; attempt < count; attempt += 1) {
      await expect(
        logInUser({ email: user.email, password: 'wrong-password1' }, now),
      ).rejects.toThrow();
    }
  }

  it('five wrong passwords lock the account; the right password is refused until the lock ends', async () => {
    const user = await makeUser('customer');
    const now = Date.now();
    await failLogins(user, 5, now);

    const form = { email: user.email, password: TEST_PASSWORD };
    await expect(logInUser(form, now + 14 * MINUTE)).rejects.toMatchObject({
      statusCode: 429,
      message: 'Too many wrong passwords. This account is locked. Try again in 1 minute.',
    });
    await expect(logInUser(form, now + 15 * MINUTE)).resolves.toHaveProperty('accessToken');
  });

  it('a right login resets the count, so the next wrong passwords start again from zero', async () => {
    const user = await makeUser('customer');
    const now = Date.now();
    const form = { email: user.email, password: TEST_PASSWORD };
    await failLogins(user, 4, now);
    await logInUser(form, now);

    await failLogins(user, 4, now);

    await expect(logInUser(form, now)).resolves.toHaveProperty('accessToken');
  });

  it('the locked answer through the route is a clear 429', async () => {
    const user = await makeUser('customer');
    await failLogins(user, 5, Date.now());

    const response = await logIn(user.email, TEST_PASSWORD);

    expect(response.status).toBe(429);
    expect(response.body.error.message).toBe(
      'Too many wrong passwords. This account is locked. Try again in 15 minutes.',
    );
  });
});

describe('the logInAs test helper', () => {
  it('logs in through the real route and sends the token with every request', async () => {
    const user = await makeUser('sales_staff', (await makeBranch()).id);

    const agent = await logInAs(user);
    const response = await agent.get('/api/health');

    const authorization = response.request.header.Authorization;
    expect(verifyAccessToken(authorization.replace('Bearer ', '')).userId).toBe(user.id);
  });
});
