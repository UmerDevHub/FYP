import { ROLE } from '@v360/shared/constants';
import { ApiError } from './ApiError.js';

// FR-AU-07: sales staff and branch managers may only touch records of their own branch.
// A service calls this after loading a record: assertBranchAccess(req.user, sellRequest.branchId).
// Staff of another branch get 403, not 404 (apps/api/CLAUDE.md). Deny by default.
export function assertBranchAccess(user, branchId) {
  if (user.role === ROLE.ADMIN) return;
  const isStaff = user.role === ROLE.SALES_STAFF || user.role === ROLE.BRANCH_MANAGER;
  if (isStaff && user.branchId === branchId) return;
  throw new ApiError(403, 'This record belongs to another branch.');
}
