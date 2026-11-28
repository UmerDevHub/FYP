// SQL only. Every write takes trx, so the service can put several writes in one transaction.

// The columns that may leave the server. password_hash is never one of them.
const PUBLIC_USER_COLUMNS = ['id', 'name', 'email', 'phone', 'role', 'branchId'];

export async function insertUser(trx, user) {
  const [savedUser] = await trx('users').insert(user).returning(PUBLIC_USER_COLUMNS);
  return savedUser;
}

export function insertRefreshToken(trx, refreshToken) {
  return trx('refreshTokens').insert(refreshToken);
}
