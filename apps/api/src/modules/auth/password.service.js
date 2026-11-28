// The password jobs of the auth module (split from auth.service.js to keep each file under 200 lines).
import { LIMITS } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/ApiError.js';
import { sendEmail } from '../../lib/mailer.js';
import { hashPassword, isPasswordCorrect } from '../../lib/password.js';
import { createRandomToken, hashToken } from '../../lib/tokens.js';
import {
  findActiveUserByEmail,
  findPasswordHash,
  findPasswordResetForUpdate,
  insertPasswordReset,
  markPasswordResetUsed,
  revokeAllRefreshTokens,
  revokeOtherRefreshTokens,
  updatePasswordHash,
} from './auth.repository.js';

const MINUTE = 60 * 1000;
const LINK_SENT_MESSAGE = 'If this e-mail is registered, a link has been sent.';
const LINK_EXPIRED_MESSAGE = 'This link has expired. Ask for a new one.';

function writeResetEmail(link) {
  return [
    'Someone asked to reset the password of your Vehicle 360 account.',
    `To choose a new password, open this link within ${LIMITS.RESET_LINK_MINUTES} minutes:`,
    link,
    'If you did not ask for this, you can ignore this e-mail.',
  ].join('\n');
}

// FR-AU-04: the answer is the same for every e-mail, so nobody can find out which ones have an account.
export async function requestPasswordReset(email, now = Date.now()) {
  const user = await findActiveUserByEmail(email);
  if (user) {
    const token = createRandomToken();
    await insertPasswordReset({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(now + LIMITS.RESET_LINK_MINUTES * MINUTE),
    });
    const link = `${env.webOrigin}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your Vehicle 360 password',
      text: writeResetEmail(link),
    });
  }
  return LINK_SENT_MESSAGE;
}

// The link works once and only until it expires. A reset ends every login of the user, so a
// person who knew the old password is logged out everywhere.
export async function resetPassword(form, now = Date.now()) {
  const passwordHash = await hashPassword(form.password);
  const isReset = await db.transaction(async (trx) => {
    const passwordReset = await findPasswordResetForUpdate(trx, hashToken(form.token));
    const isUsable =
      passwordReset &&
      passwordReset.usedAt === null &&
      new Date(passwordReset.expiresAt).getTime() > now;
    if (!isUsable) return false;

    await updatePasswordHash(trx, passwordReset.userId, passwordHash);
    await markPasswordResetUsed(trx, passwordReset.id, new Date(now));
    await revokeAllRefreshTokens(trx, passwordReset.userId, new Date(now));
    return true;
  });
  if (!isReset) throw new ApiError(400, LINK_EXPIRED_MESSAGE);
  return 'Your password has been changed. Log in with your new password.';
}

// FR-AU-05: the old password is checked first. Every other login of the user ends, so a person
// who knew the old password is logged out; the device that asked stays logged in.
export async function changePassword(userId, form, currentRefreshToken, now = Date.now()) {
  const isOldPasswordRight = await isPasswordCorrect(
    form.oldPassword,
    await findPasswordHash(userId),
  );
  if (!isOldPasswordRight) throw new ApiError(400, 'Your old password is not right.');

  const passwordHash = await hashPassword(form.newPassword);
  await db.transaction(async (trx) => {
    await updatePasswordHash(trx, userId, passwordHash);
    await revokeOtherRefreshTokens(
      trx,
      userId,
      hashToken(currentRefreshToken ?? ''),
      new Date(now),
    );
  });
  return 'Your password has been changed.';
}
