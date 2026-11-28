import { INSPECTION_STATUS, VEHICLE_STATUS } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { ApiError } from '../../lib/ApiError.js';
import { assertBranchAccess } from '../../lib/assertBranchAccess.js';
import { changeStatus } from '../../lib/changeStatus.js';
import { findVehicleById } from '../vehicles/vehicles.repository.js';
import {
  findChecklistItems,
  findEvents,
  findInspectionById,
  findInspectionsOfBranch,
  findPhotos,
  findResults,
  insertEvent,
  insertInspection,
} from './inspections.repository.js';

// FR-SS-08: the inspection queue of the user's own branch.
export function listInspections(user, status) {
  return findInspectionsOfBranch(user.branchId, status);
}

// Loads one inspection and checks the branch (FR-AU-07). Used by the other inspection services.
export async function loadInspection(user, inspectionId) {
  const inspection = await findInspectionById(inspectionId);
  if (!inspection) throw new ApiError(404, 'This inspection does not exist.');
  assertBranchAccess(user, inspection.branchId);
  return inspection;
}

// Everything the inspection form and the manager's review need.
export async function getInspection(user, inspectionId) {
  const inspection = await loadInspection(user, inspectionId);
  return {
    ...inspection,
    checklist: await findChecklistItems(),
    results: await findResults(inspectionId),
    photos: await findPhotos(inspectionId),
    events: await findEvents(inspectionId),
  };
}

// FR-IN-01: sales staff start an inspection for a Received car of their branch. The car becomes
// Under inspection. Only one open inspection per car (the database refuses a second one).
export async function startInspection(staff, vehicleId) {
  const vehicle = await findVehicleById(vehicleId);
  if (!vehicle) throw new ApiError(404, 'This car does not exist.');
  assertBranchAccess(staff, vehicle.branchId);
  if (vehicle.status !== VEHICLE_STATUS.RECEIVED) {
    throw new ApiError(409, 'Only a received car can be inspected.');
  }

  return db.transaction(async (trx) => {
    const inspectionId = await insertInspection(trx, {
      vehicleId,
      inspectorId: staff.id,
      status: INSPECTION_STATUS.DRAFT,
    });
    await changeStatus(trx, {
      recordType: 'vehicle',
      id: vehicleId,
      toStatus: VEHICLE_STATUS.UNDER_INSPECTION,
      userId: staff.id,
      note: 'Inspection started',
    });
    await insertEvent(trx, { inspectionId, action: 'started', userId: staff.id });
    return { id: inspectionId };
  });
}
