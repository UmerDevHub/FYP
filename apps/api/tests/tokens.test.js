import { describe, expect, it } from 'vitest';
import { hashPassword, isPasswordCorrect } from '../src/lib/password.js';
import {
  createRandomToken,
  hashToken,
  signAccessToken,
  verifyAccessToken,
} from '../src/lib/tokens.js';

const user = { id: 7, role: 'sales_staff', branchId: 2 };
const MINUTE = 60 * 1000;

describe('password helper', () => {
  it('stores a hash that is not the password and still matches it', async () => {
    const hash = await hashPassword('Vehicle360demo');

    expect(hash).not.toContain('Vehicle360demo');
    expect(await isPasswordCorrect('Vehicle360demo', hash)).toBe(true);
    expect(await isPasswordCorrect('wrong-password1', hash)).toBe(false);
  });
});

describe('access token', () => {
  it('holds only the user id, role and branch id', () => {
    const payload = verifyAccessToken(signAccessToken(user));

    expect(payload.userId).toBe(7);
    expect(payload.role).toBe('sales_staff');
    expect(payload.branchId).toBe(2);
    expect(Object.keys(payload).sort()).toEqual(['branchId', 'exp', 'iat', 'role', 'userId']);
  });

  it('is refused after 15 minutes', () => {
    const now = Date.now();
    const token = signAccessToken(user, now);

    expect(() => verifyAccessToken(token, now + 14 * MINUTE)).not.toThrow();
    expect(() => verifyAccessToken(token, now + 16 * MINUTE)).toThrow('jwt expired');
  });

  it('is refused when someone changes it', () => {
    const token = signAccessToken(user);
    const [header, , signature] = token.split('.');
    const fakePayload = Buffer.from(JSON.stringify({ userId: 1, role: 'admin' })).toString(
      'base64url',
    );

    expect(() => verifyAccessToken(`${header}.${fakePayload}.${signature}`)).toThrow();
  });
});

describe('refresh token', () => {
  it('is long and random', () => {
    expect(createRandomToken()).toHaveLength(64);
    expect(createRandomToken()).not.toBe(createRandomToken());
  });

  it('is stored as a hash that is not the raw value', () => {
    const token = createRandomToken();

    expect(hashToken(token)).not.toBe(token);
    expect(hashToken(token)).toBe(hashToken(token));
  });
});
