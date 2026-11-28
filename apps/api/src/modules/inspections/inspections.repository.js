import { db } from '../../config/db.js';

// SQL only.
const INSPECTION_COLUMNS = [
  'inspections.id',
  'inspections.vehicleId',
  'inspections.inspectorId',
  'inspections.mileageKm',
  'inspections.documentsVerified',
  'inspections.documentNotes',
  'inspections.damageNotes',
  'inspections.status',
  'inspections.submittedAt',
  'inspections.reviewRemarks',
  'inspections.createdAt',
  'vehicles.branchId',
  'vehicles.make',
  'vehicles.model',
  'vehicles.year',
  'vehicles.registrationNo',
  'users.name as inspectorName',
];

function selectInspections() {
  return db('inspections')
    .join('vehicles', 'vehicles.id', 'inspections.vehicleId')
    .join('users', 'users.id', 'inspections.inspectorId')
    .select(INSPECTION_COLUMNS);
}

export function findChecklistItems() {
  return db('checklistItems')
    .select(['id', 'category', 'name'])
    .where({ isActive: true })
    .orderBy('sortOrder');
}

export function findInspectionsOfBranch(branchId, status) {
  const query = selectInspections().where('vehicles.branchId', branchId);
  if (status) {
    query.where('inspections.status', status);
  }
  return query.orderBy('inspections.createdAt', 'desc');
}

export function findInspectionById(id) {
  return selectInspections().where('inspections.id', id).first();
}

export function findResults(inspectionId) {
  return db('inspectionResults')
    .select(['checklistItemId', 'result', 'remarks'])
    .where({ inspectionId });
}

export function findPhotos(inspectionId) {
  return db('inspectionPhotos')
    .select(['id', 'filePath', 'caption'])
    .where({ inspectionId })
    .orderBy('id');
}

export function findEvents(inspectionId) {
  return db('inspectionEvents')
    .join('users', 'users.id', 'inspectionEvents.userId')
    .select(['inspectionEvents.action', 'inspectionEvents.remarks', 'inspectionEvents.createdAt'])
    .select('users.name as userName')
    .where({ inspectionId })
    .orderBy('inspectionEvents.id');
}

export async function insertInspection(trx, inspection) {
  const [saved] = await trx('inspections').insert(inspection).returning(['id']);
  return saved.id;
}

export function insertEvent(trx, event) {
  return trx('inspectionEvents').insert(event);
}

export function updateDraft(trx, inspectionId, fields) {
  return trx('inspections')
    .where({ id: inspectionId })
    .update({ ...fields, updatedAt: trx.fn.now() });
}

// A draft is saved many times: the old answers are removed and the latest are written, so each
// checklist item keeps exactly one answer (a common mistake in the book).
export async function replaceResults(trx, inspectionId, results) {
  await trx('inspectionResults').where({ inspectionId }).delete();
  if (results.length === 0) return;
  const rows = results.map((result) => ({ ...result, inspectionId }));
  await trx('inspectionResults').insert(rows);
}

export function insertPhoto(photo) {
  return db('inspectionPhotos').insert(photo);
}

export async function countPhotos(inspectionId) {
  const [row] = await db('inspectionPhotos').where({ inspectionId }).count('id as total');
  return Number(row.total);
}
