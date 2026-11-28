import { LIMITS } from '@v360/shared/constants';
import bcrypt from 'bcryptjs';

// bcrypt adds a random salt, so two users with the same password get different hashes (NFR-SC-01).
export function hashPassword(password) {
  return bcrypt.hash(password, LIMITS.BCRYPT_COST);
}

export function isPasswordCorrect(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
