import { ApiError } from '../lib/ApiError.js';
import { verifyAccessToken } from '../lib/tokens.js';

// FR-AU-06: every protected route starts with authenticate. It reads "Authorization: Bearer <token>"
// and puts the caller on req.user. Role and branch come from the signed token, never from the body.
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'You need to log in first.');
  }
  const token = header.slice('Bearer '.length);

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    // Expired, changed or made up: the screen will try one refresh and then ask to log in again.
    throw new ApiError(401, 'You need to log in first.');
  }
  req.user = { id: payload.userId, role: payload.role, branchId: payload.branchId };
  next();
}

// Use after authenticate: requireRole('sales_staff', 'branch_manager').
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'This page is not for your account.');
    }
    next();
  };
}
