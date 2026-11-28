import { randomUUID } from 'node:crypto';
import { LIMITS, ROLE } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { ApiError } from '../../lib/ApiError.js';
import { hashPassword, isPasswordCorrect } from '../../lib/password.js';
import { createRefreshToken, hashToken, signAccessToken } from '../../lib/tokens.js';
import {
  addFailedLogin,
  clearFailedLogins,
  findUserForLogin,
  insertRefreshToken,
  insertUser,
  lockUser,
} from './auth.repository.js';

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

// FR-AU-02: one message for a wrong e-mail, a wrong password and an inactive account.
const WRONG_LOGIN_MESSAGE = 'The e-mail or password is not right.';

// Checked when the e-mail is unknown, so that answer takes as long as a wrong password and
// nobody can find out by timing which e-mails have an account.
const FAKE_PASSWORD_HASH = await hashPassword('no-account-has-this-password');

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

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    branchId: user.branchId,
  };
}

function isLocked(user, now) {
  return user.lockedUntil !== null && new Date(user.lockedUntil).getTime() > now;
}

// A-18: an honest message that says when the person can try again.
function createLockedError(lockedUntil, now) {
  const minutesLeft = Math.ceil((new Date(lockedUntil).getTime() - now) / MINUTE);
  const unit = minutesLeft === 1 ? 'minute' : 'minutes';
  return new ApiError(
    429,
    `Too many wrong passwords. This account is locked. Try again in ${minutesLeft} ${unit}.`,
  );
}

// Counts a wrong password; the fifth one locks the account for LIMITS.LOCK_MINUTES.
async function recordWrongPassword(user, now) {
  const failedLogins = await addFailedLogin(user.id);
  if (failedLogins >= LIMITS.FAILED_LOGINS_BEFORE_LOCK) {
    await lockUser(user.id, new Date(now + LIMITS.LOCK_MINUTES * MINUTE));
  }
}

export async function logInUser(form, now = Date.now()) {
  const user = await findUserForLogin(form.email);
  if (!user) {
    await isPasswordCorrect(form.password, FAKE_PASSWORD_HASH);
    throw new ApiError(401, WRONG_LOGIN_MESSAGE);
  }
  if (isLocked(user, now)) throw createLockedError(user.lockedUntil, now);

  const isCorrect = await isPasswordCorrect(form.password, user.passwordHash);
  if (!isCorrect) await recordWrongPassword(user, now);
  if (!isCorrect || !user.isActive) throw new ApiError(401, WRONG_LOGIN_MESSAGE);

  await clearFailedLogins(user.id);
  return db.transaction((trx) => startSession(trx, toPublicUser(user), now));
}
