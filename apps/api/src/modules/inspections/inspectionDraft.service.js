import { INSPECTION_STATUS, LIMITS } from '@v360/shared/constants';
import { db } from '../../config/db.js';
import { ApiError } from '../../lib/ApiError.js';
import { changeStatus } from '../../lib/changeStatus.js';
import { deletePhoto, savePhoto } from '../../lib/files.js';
import { notify } from '../../lib/notify.js';
import {
  countPhotos,
  findChecklistItems,
  findResults,
  insertEvent,
  insertPhoto,
  replaceResults,
  updateDraft,
} from './inspections.repository.js';
import { findBranchManagers } from '../sell-requests/sellRequests.repository.js';
import { getInspection, loadInspection } from './inspections.service.js';

// FR-IN-06: only the inspector changes an inspection, and only while it is a draft or after a
// manager returned it. After submit nothing can change.
async function loadEditableInspection(staff, inspectionId) {
  const inspection = await loadInspection(staff, inspectionId);
  if (inspection.inspectorId !== staff.id) {
    throw new ApiError(403, 'Only the inspector of this inspection can change it.');
  }
  const isEditable =
    inspection.status === INSPECTION_STATUS.DRAFT ||
    inspection.status === INSPECTION_STATUS.RETURNED;
  if (!isEditable) {
    throw new ApiError(409, 'This inspection is submitted and cannot be changed.');
  }
  return inspection;
}

// FR-IN-06: a draft can always be saved, even when it is not complete.
export async function saveDraft(staff, inspectionId, form) {
  await loadEditableInspection(staff, inspectionId);
  await db.transaction(async (trx) => {
    await updateDraft(trx, inspectionId, {
      mileageKm: form.mileageKm ?? null,
      documentsVerified: form.documentsVerified,
      documentNotes: form.documentNotes ?? null,
      damageNotes: form.damageNotes ?? null,
    });
    await replaceResults(trx, inspectionId, form.results);
  });
  return getInspection(staff, inspectionId);
}

// FR-IN-05: one photo with a caption. If the database save fails, the file is deleted again.
export async function addPhoto(staff, inspectionId, file, caption) {
  await loadEditableInspection(staff, inspectionId);
  const fileName = await savePhoto(file.buffer);
  try {
    await insertPhoto({ inspectionId, filePath: fileName, caption: caption ?? null });
  } catch (error) {
    await deletePhoto(fileName);
    throw error;
  }
  return getInspection(staff, inspectionId);
}

// Every part that is still missing, in plain words, so the inspector can fix all at once.
async function findMissingParts(inspection) {
  const missing = [];
  const checklist = await findChecklistItems();
  const results = await findResults(inspection.id);
  const unanswered = checklist.length - results.length;
  if (unanswered > 0) missing.push(`${unanswered} checklist items have no answer.`);
  if (inspection.mileageKm === null) missing.push('Enter the mileage.');
  const photoCount = await countPhotos(inspection.id);
  if (photoCount < LIMITS.MIN_INSPECTION_PHOTOS) {
    missing.push(`Add at least ${LIMITS.MIN_INSPECTION_PHOTOS} photos (now ${photoCount}).`);
  }
  return missing;
}

// FR-IN-06: submit only when every item is answered, the mileage is entered and at least
// 4 photos are added (A-06). The managers of the branch get an in-app notification (Table 3.1).
export async function submitInspection(staff, inspectionId) {
  const inspection = await loadEditableInspection(staff, inspectionId);
  const missing = await findMissingParts(inspection);
  if (missing.length > 0) {
    throw new ApiError(400, 'The inspection is not complete yet.', { missing });
  }

  await db.transaction(async (trx) => {
    await changeStatus(trx, {
      recordType: 'inspection',
      id: inspectionId,
      toStatus: INSPECTION_STATUS.SUBMITTED,
      userId: staff.id,
      changes: { submittedAt: trx.fn.now() },
    });
    await insertEvent(trx, { inspectionId, action: 'submitted', userId: staff.id });
  });

  for (const manager of await findBranchManagers(inspection.branchId)) {
    await notify({
      user: manager,
      title: 'Inspection submitted',
      message: `${inspection.inspectorName} submitted the inspection of the ${inspection.year} ${inspection.make} ${inspection.model}.`,
      link: `/staff/inspections/${inspectionId}`,
    });
  }
  return getInspection(staff, inspectionId);
}
