import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { verifyAccessToken } from '../src/lib/tokens.js';
import { refreshSession } from '../src/modules/auth/auth.service.js';
import { makeUser, TEST_PASSWORD, testDb } from './helpers.js';

const DAY = 24 * 60 * 60 * 1000;
const SESSION_ENDED = 'Your session has ended. Log in again.';

function readRefreshToken(response) {
  const line = response.headers['set-cookie'].find((cookie) => cookie.startsWith('refreshToken='));
  return line.split(';')[0].split('=')[1];
}

async function logInAndGetRefreshToken() {
  const user = await makeUser('customer');
  const response = await request(createApp())
    .post('/api/auth/login')
    .send({ email: user.email, password: TEST_PASSWORD });
  return { user, refreshToken: readRefreshToken(response) };
}

function refresh(refreshToken) {
  return request(createApp())
    .post('/api/auth/refresh')
    .set('Cookie', `refreshToken=${refreshToken}`);
}

describe('POST /api/auth/refresh (FR-AU-03, NFR-SC-04)', () => {
  it('swaps the refresh token for a new pair and keeps the user logged in', async () => {
    const { user, refreshToken } = await logInAndGetRefreshToken();

    const response = await refresh(refreshToken);

    expect(response.status).toBe(200);
    expect(verifyAccessToken(response.body.data.accessToken).userId).toBe(user.id);
    expect(readRefreshToken(response)).not.toBe(refreshToken);
  });

  it('an old token used a second time cancels the whole family', async () => {
    const { refreshToken: firstToken } = await logInAndGetRefreshToken();
    const secondToken = readRefreshToken(await refresh(firstToken));

    // Someone replays the first token (for example after stealing it).
    const replay = await refresh(firstToken);
    expect(replay.status).toBe(401);
    expect(replay.body.error.message).toBe(SESSION_ENDED);

    // The newest token of the same family no longer works either.
    expect((await refresh(secondToken)).status).toBe(401);
  });

  it('an expired refresh token is refused', async () => {
    const { refreshToken } = await logInAndGetRefreshToken();

    await expect(refreshSession(refreshToken, Date.now() + 8 * DAY)).rejects.toMatchObject({
      statusCode: 401,
      message: SESSION_ENDED,
    });
  });

  it('a missing or unknown cookie is refused', async () => {
    expect((await request(createApp()).post('/api/auth/refresh')).status).toBe(401);
    expect((await refresh('a'.repeat(64))).status).toBe(401);
  });

  it('the table holds only hashes, never a raw token', async () => {
    const { user, refreshToken } = await logInAndGetRefreshToken();
    const newToken = readRefreshToken(await refresh(refreshToken));

    const rows = await testDb('refreshTokens').where({ userId: user.id });
    const storedValues = rows.map((row) => row.tokenHash);
    expect(rows).toHaveLength(2);
    expect(storedValues).not.toContain(refreshToken);
    expect(storedValues).not.toContain(newToken);
  });
});

describe('POST /api/auth/logout (FR-AU-03)', () => {
  it('cancels the refresh token and clears the cookie', async () => {
    const { refreshToken } = await logInAndGetRefreshToken();

    const response = await request(createApp())
      .post('/api/auth/logout')
      .set('Cookie', `refreshToken=${refreshToken}`);

    expect(response.status).toBe(204);
    expect(response.headers['set-cookie'].join(';')).toMatch(
      /refreshToken=;.*Expires=Thu, 01 Jan 1970/,
    );
    expect((await refresh(refreshToken)).status).toBe(401);
  });
});
