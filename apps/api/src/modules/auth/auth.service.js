import { randomUUID } from 'node:crypto';
import { LIMITS, ROLE } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { hashPassword } from '../../lib/password.js';
import { createRefreshToken, hashToken, signAccessToken } from '../../lib/tokens.js';
import { insertRefreshToken, insertUser } from './auth.repository.js';

const DAY = 24 * 60 * 60 * 1000;

// A new login: one access token, and one refresh token that starts a new token family.
// Only the hash of the refresh token is stored (NFR-SC-04).
async function startSession(trx, user, now) {
  const refreshToken = createRefreshToken();
  await insertRefreshToken(trx, {
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    familyId: randomUUID(),
    expiresAt: new Date(now + LIMITS.REFRESH_TOKEN_DAYS * DAY),
  });
  return { user, accessToken: signAccessToken(user, now), refreshToken };
}

// FR-AU-01: the role is always customer. The schema already dropped any role the client sent.
// A duplicate e-mail is refused by the database (users_email_unique) and becomes a 409.
export async function registerCustomer(form, now = Date.now()) {
  const passwordHash = await hashPassword(form.password);
  return db.transaction(async (trx) => {
    const user = await insertUser(trx, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      passwordHash,
      role: ROLE.CUSTOMER,
    });
    return startSession(trx, user, now);
  });
}
