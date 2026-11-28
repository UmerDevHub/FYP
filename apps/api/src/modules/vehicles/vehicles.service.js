import { SELL_REQUEST_STATUS, VEHICLE_STATUS } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { ApiError } from '../../lib/ApiError.js';
import { logActivity } from '../../lib/activityLog.js';
import { assertBranchAccess } from '../../lib/assertBranchAccess.js';
import { addVehicleHistory, changeStatus } from '../../lib/changeStatus.js';
import { findSellRequestById } from '../sell-requests/sellRequests.repository.js';
import { insertVehicle } from './vehicles.repository.js';

// Only an accepted request of the staff member's branch that has not expired may arrive.
// The expiry is checked here too, even if the hourly expiry job (S8) has not run yet.
async function checkSellRequestCanArrive(staff, sellRequestId, now) {
  const sellRequest = await findSellRequestById(sellRequestId);
  if (!sellRequest) throw new ApiError(404, 'This sell request does not exist.');
  assertBranchAccess(staff, sellRequest.branchId);

  if (sellRequest.status !== SELL_REQUEST_STATUS.ACCEPTED) {
    throw new ApiError(
      409,
      `Only an accepted sell request can arrive. This one is ${sellRequest.status}.`,
    );
  }
  if (new Date(sellRequest.expiresAt).getTime() <= now) {
    throw new ApiError(409, 'This sell request has expired. The customer must send a new one.');
  }
}

// FR-SS-01: a car arrives, from an accepted sell request or as a walk-in (no request).
// One transaction: the car is created as Received, the request becomes Completed and the first
// history row is written. If any step fails, nothing is saved.
export async function recordArrival(staff, form, now = Date.now()) {
  if (form.sellRequestId) {
    await checkSellRequestCanArrive(staff, form.sellRequestId, now);
  }

  return db.transaction(async (trx) => {
    if (form.sellRequestId) {
      await changeStatus(trx, {
        recordType: 'sellRequest',
        id: form.sellRequestId,
        toStatus: SELL_REQUEST_STATUS.COMPLETED,
        userId: staff.id,
      });
    }

    const vehicle = await insertVehicle(trx, {
      ...form,
      sellRequestId: form.sellRequestId ?? null,
      branchId: staff.branchId,
      status: VEHICLE_STATUS.RECEIVED,
      receivedAt: new Date(now),
    });
    await addVehicleHistory(trx, {
      vehicleId: vehicle.id,
      fromStatus: null,
      toStatus: VEHICLE_STATUS.RECEIVED,
      userId: staff.id,
      note: form.sellRequestId ? 'Arrived from a sell request' : 'Walk-in arrival',
    });
    await logActivity(trx, {
      userId: staff.id,
      action: 'vehicle_arrived',
      entityType: 'vehicle',
      entityId: vehicle.id,
    });
    return vehicle;
  });
}
