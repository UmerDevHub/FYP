import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { sentEmails } from '../src/lib/mailer.js';
import { hashToken } from '../src/lib/tokens.js';
import { resetPassword } from '../src/modules/auth/password.service.js';
import { makeUser, TEST_PASSWORD, testDb } from './helpers.js';

const LINK_SENT = 'If this e-mail is registered, a link has been sent.';
const LINK_EXPIRED = 'This link has expired. Ask for a new one.';
const MINUTE = 60 * 1000;

function forgotPassword(email) {
  return request(createApp()).post('/api/auth/forgot-password').send({ email });
}

function reset(token, password) {
  return request(createApp()).post('/api/auth/reset-password').send({ token, password });
}

// Reads the token from the last link the mailer "sent" to this address.
function readResetToken(email) {
  const message = sentEmails.findLast((sent) => sent.to === email);
  return new URL(message.text.match(/https?:\/\/\S+/)[0]).searchParams.get('token');
}

describe('POST /api/auth/forgot-password (FR-AU-04)', () => {
  it('sends a one-time link to a registered e-mail', async () => {
    const user = await makeUser('customer');

    const response = await forgotPassword(user.email);

    expect(response.status).toBe(200);
    expect(response.body.data.message).toBe(LINK_SENT);
    expect(readResetToken(user.email)).toHaveLength(64);
  });

  it('gives an unknown e-mail the same answer and sends nothing', async () => {
    const emailsBefore = sentEmails.length;

    const response = await forgotPassword('nobody@vehicle360.test');

    expect(response.status).toBe(200);
    expect(response.body.data.message).toBe(LINK_SENT);
    expect(sentEmails.length).toBe(emailsBefore);
  });

  it('stores only the hash of the token', async () => {
    const user = await makeUser('customer');
    await forgotPassword(user.email);
    const token = readResetToken(user.email);

    const rows = await testDb('passwordResets').where({ userId: user.id });
    expect(rows).toHaveLength(1);
    expect(rows[0].tokenHash).toBe(hashToken(token));
    expect(rows[0].tokenHash).not.toBe(token);
  });
});

describe('POST /api/auth/reset-password (FR-AU-04)', () => {
  it('the link sets a new password and works only once', async () => {
    const user = await makeUser('customer');
    await forgotPassword(user.email);
    const token = readResetToken(user.email);

    const first = await reset(token, 'brandnew12');
    expect(first.status).toBe(200);
    const login = await request(createApp())
      .post('/api/auth/login')
      .send({ email: user.email, password: 'brandnew12' });
    expect(login.status).toBe(200);

    const second = await reset(token, 'another123');
    expect(second.status).toBe(400);
    expect(second.body.error.message).toBe(LINK_EXPIRED);
  });

  it('an expired link is refused', async () => {
    const user = await makeUser('customer');
    await forgotPassword(user.email);
    const token = readResetToken(user.email);

    await expect(
      resetPassword({ token, password: 'brandnew12' }, Date.now() + 61 * MINUTE),
    ).rejects.toMatchObject({ statusCode: 400, message: LINK_EXPIRED });
  });

  it('a made-up link is refused', async () => {
    expect((await reset('a'.repeat(64), 'brandnew12')).status).toBe(400);
  });

  it('after the reset the old refresh token no longer works', async () => {
    const user = await makeUser('customer');
    const login = await request(createApp())
      .post('/api/auth/login')
      .send({ email: user.email, password: TEST_PASSWORD });
    const oldCookie = login.headers['set-cookie'].find((line) => line.startsWith('refreshToken='));
    await forgotPassword(user.email);

    await reset(readResetToken(user.email), 'brandnew12');

    const refresh = await request(createApp())
      .post('/api/auth/refresh')
      .set('Cookie', oldCookie.split(';')[0]);
    expect(refresh.status).toBe(401);
  });
});
