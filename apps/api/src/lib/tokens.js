import { createHash, randomBytes } from 'node:crypto';
import { LIMITS } from '@v360/shared/constants';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ALGORITHM = 'HS256';

function toSeconds(milliseconds) {
  return Math.floor(milliseconds / 1000);
}

// The access token says who is calling. It holds only the user id, role and branch id: never a password
// or anything private. "now" is a parameter so a test can choose the time.
export function signAccessToken(user, now = Date.now()) {
  const issuedAt = toSeconds(now);
  const payload = {
    userId: user.id,
    role: user.role,
    branchId: user.branchId,
    iat: issuedAt,
    exp: issuedAt + LIMITS.ACCESS_TOKEN_MINUTES * 60,
  };
  return jwt.sign(payload, env.jwtAccessSecret, { algorithm: ALGORITHM });
}

// Throws when the token is expired, changed or signed with another secret.
export function verifyAccessToken(token, now = Date.now()) {
  return jwt.verify(token, env.jwtAccessSecret, {
    algorithms: [ALGORITHM],
    clockTimestamp: toSeconds(now),
  });
}

// The refresh token is a random string, not a JWT: it only has to be impossible to guess.
export function createRefreshToken() {
  return randomBytes(32).toString('hex');
}

// Only this hash is stored, so a copy of the database does not give anyone a working token.
export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}
