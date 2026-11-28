import {
  INSPECTION_TRANSITIONS,
  isTransitionAllowed,
  SELL_REQUEST_TRANSITIONS,
  VEHICLE_TRANSITIONS,
} from '../config/transitions.js';
import { ApiError } from './ApiError.js';
import { logActivity } from './activityLog.js';

// The one door for every status change (CLAUDE.md: never update a status column directly).
// It checks transitions.js, updates the row, writes the vehicle history row and the audit row.
// The caller passes its transaction (trx), so everything is saved together or not at all.

const RECORD_TYPES = {
  sellRequest: {
    table: 'sellRequests',
    transitions: SELL_REQUEST_TRANSITIONS,
    label: 'sell request',
  },
  vehicle: { table: 'vehicles', transitions: VEHICLE_TRANSITIONS, label: 'car' },
  inspection: { table: 'inspections', transitions: INSPECTION_TRANSITIONS, label: 'inspection' },
};

function toWords(status) {
  return status.replaceAll('_', ' ');
}

// FR-AC-03: the history of a vehicle, also used once when a car arrives (no "from" status yet).
export function addVehicleHistory(trx, { vehicleId, fromStatus, toStatus, userId, note }) {
  return trx('vehicleStatusHistory').insert({
    vehicleId,
    fromStatus,
    toStatus,
    changedBy: userId,
    note,
  });
}

// changes: other columns to save with the new status, for example { expiresAt }.
export async function changeStatus(
  trx,
  { recordType, id, toStatus, userId, note = null, changes = {} },
) {
  const type = RECORD_TYPES[recordType];
  // FOR UPDATE: two people cannot change the same record at the same moment.
  const record = await trx(type.table).where({ id }).forUpdate().first();
  if (!record) throw new ApiError(404, `This ${type.label} does not exist.`);

  if (!isTransitionAllowed(type.transitions, record.status, toStatus)) {
    throw new ApiError(
      409,
      `This ${type.label} is ${toWords(record.status)} and cannot become ${toWords(toStatus)}.`,
    );
  }

  const [updatedRecord] = await trx(type.table)
    .where({ id })
    .update({ ...changes, status: toStatus, updatedAt: trx.fn.now() })
    .returning('*');

  if (recordType === 'vehicle') {
    await addVehicleHistory(trx, {
      vehicleId: id,
      fromStatus: record.status,
      toStatus,
      userId,
      note,
    });
  }
  await logActivity(trx, {
    userId,
    action: 'status_change',
    entityType: recordType,
    entityId: id,
    oldValue: { status: record.status },
    newValue: { status: toStatus },
  });
  return updatedRecord;
}
