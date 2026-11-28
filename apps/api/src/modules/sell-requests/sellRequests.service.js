import { LIMITS, ROLE, SELL_REQUEST_STATUS } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { ApiError } from '../../lib/ApiError.js';
import { logActivity } from '../../lib/activityLog.js';
import { assertBranchAccess } from '../../lib/assertBranchAccess.js';
import { changeStatus } from '../../lib/changeStatus.js';
import { formatDateForPeople } from '../../lib/formatForPeople.js';
import { notify } from '../../lib/notify.js';
import {
  findActiveBranch,
  findBranchManagers,
  findSellRequestById,
  findSellRequestsOfBranch,
  findSellRequestsOfCustomer,
  insertSellRequest,
} from './sellRequests.repository.js';

const DAY = 24 * 60 * 60 * 1000;

function describeCar(sellRequest) {
  return `${sellRequest.year} ${sellRequest.make} ${sellRequest.model}`;
}

// FR-CU-11: a logged-in customer sends a request; it starts as Pending (A-03).
// The managers of the chosen branch get a notification and an e-mail (Table 3.1).
export async function createSellRequest(customerId, form) {
  const branch = await findActiveBranch(form.branchId);
  if (!branch) throw new ApiError(400, 'Choose a branch from the list.');

  const sellRequestId = await db.transaction(async (trx) => {
    const id = await insertSellRequest(trx, { ...form, customerId });
    await logActivity(trx, {
      userId: customerId,
      action: 'sell_request_sent',
      entityType: 'sellRequest',
      entityId: id,
    });
    return id;
  });

  // Notifications go out after the save, so nobody hears about a request that was not saved.
  const sellRequest = await findSellRequestById(sellRequestId);
  for (const manager of await findBranchManagers(sellRequest.branchId)) {
    await notify({
      user: manager,
      title: 'New sell request',
      message: `${sellRequest.customerName} wants to sell a ${describeCar(sellRequest)} at ${branch.name}.`,
      link: '/staff/sell-requests',
      isEmailNeeded: true,
    });
  }
  return sellRequest;
}

// FR-CU-12: a customer sees their own requests, also after they are finished.
export function listMySellRequests(customerId) {
  return findSellRequestsOfCustomer(customerId);
}

// FR-SS-08 and FR-AU-07: staff and managers see only their own branch.
export function listBranchSellRequests(user, status) {
  return findSellRequestsOfBranch(user.branchId, status);
}

// The owner, or staff of the request's branch. Another customer gets 404 (it does not exist for
// them); staff of another branch get 403 (apps/api/CLAUDE.md).
export async function getSellRequest(user, sellRequestId) {
  const sellRequest = await findSellRequestById(sellRequestId);
  if (!sellRequest) throw new ApiError(404, 'This sell request does not exist.');
  if (user.role === ROLE.CUSTOMER) {
    if (sellRequest.customerId !== user.id) {
      throw new ApiError(404, 'This sell request does not exist.');
    }
    return sellRequest;
  }
  assertBranchAccess(user, sellRequest.branchId);
  return sellRequest;
}

// FR-BM-01: the manager of the branch accepts. The seller must arrive within 7 days (A-03).
export async function acceptSellRequest(manager, sellRequestId, now = Date.now()) {
  const sellRequest = await getSellRequest(manager, sellRequestId);
  const expiresAt = new Date(now + LIMITS.SELL_REQUEST_EXPIRY_DAYS * DAY);
  await db.transaction((trx) =>
    changeStatus(trx, {
      recordType: 'sellRequest',
      id: sellRequestId,
      toStatus: SELL_REQUEST_STATUS.ACCEPTED,
      userId: manager.id,
      changes: { decidedBy: manager.id, decidedAt: new Date(now), expiresAt },
    }),
  );

  await notify({
    user: { id: sellRequest.customerId, email: sellRequest.customerEmail },
    title: 'Sell request accepted',
    message: `${sellRequest.branchName} accepted your request for the ${describeCar(sellRequest)}. Please bring the car to the branch by ${formatDateForPeople(expiresAt)}.`,
    link: '/my-requests',
    isEmailNeeded: true,
  });
  return findSellRequestById(sellRequestId);
}

// FR-BM-01: a rejection needs a reason, which the customer sees.
export async function rejectSellRequest(manager, sellRequestId, reason, now = Date.now()) {
  const sellRequest = await getSellRequest(manager, sellRequestId);
  await db.transaction((trx) =>
    changeStatus(trx, {
      recordType: 'sellRequest',
      id: sellRequestId,
      toStatus: SELL_REQUEST_STATUS.REJECTED,
      userId: manager.id,
      note: reason,
      changes: { decidedBy: manager.id, decidedAt: new Date(now), decisionReason: reason },
    }),
  );

  await notify({
    user: { id: sellRequest.customerId, email: sellRequest.customerEmail },
    title: 'Sell request not accepted',
    message: `${sellRequest.branchName} could not accept your request for the ${describeCar(sellRequest)}. Reason: ${reason}`,
    link: '/my-requests',
    isEmailNeeded: true,
  });
  return findSellRequestById(sellRequestId);
}
