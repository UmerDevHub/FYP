import { db } from '../../config/db.js';

// SQL only. Writes that belong together take trx, so the service can put them in one transaction.

// The columns that may leave the server. password_hash is never one of them.
const PUBLIC_USER_COLUMNS = ['id', 'name', 'email', 'phone', 'role', 'branchId'];

export async function insertUser(trx, user) {
  const [savedUser] = await trx('users').insert(user).returning(PUBLIC_USER_COLUMNS);
  return savedUser;
}

// For login only: the one query that reads the password hash and the lock columns.
export function findUserForLogin(email) {
  return db('users')
    .select([...PUBLIC_USER_COLUMNS, 'passwordHash', 'isActive', 'failedLogins', 'lockedUntil'])
    .where({ email })
    .first();
}

// Counted in the database (failed_logins + 1), so two wrong logins at the same moment both count.
export async function addFailedLogin(userId) {
  const [user] = await db('users')
    .where({ id: userId })
    .increment('failedLogins', 1)
    .returning(['failedLogins']);
  return user.failedLogins;
}

export function lockUser(userId, lockedUntil) {
  return db('users').where({ id: userId }).update({ failedLogins: 0, lockedUntil });
}

export function clearFailedLogins(userId) {
  return db('users').where({ id: userId }).update({ failedLogins: 0, lockedUntil: null });
}

export function insertRefreshToken(trx, refreshToken) {
  return trx('refreshTokens').insert(refreshToken);
}

// FOR UPDATE locks the row until the transaction ends: two refreshes of one token cannot both pass.
export function findRefreshTokenForUpdate(trx, tokenHash) {
  return trx('refreshTokens').where({ tokenHash }).forUpdate().first();
}

export function revokeRefreshToken(trx, id, revokedAt) {
  return trx('refreshTokens').where({ id }).update({ revokedAt });
}

export function revokeTokenFamily(trx, familyId, revokedAt) {
  return trx('refreshTokens').where({ familyId, revokedAt: null }).update({ revokedAt });
}

export function findActiveUserById(trx, userId) {
  return trx('users').select(PUBLIC_USER_COLUMNS).where({ id: userId, isActive: true }).first();
}
