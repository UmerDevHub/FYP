import { ROLE } from '@v360/shared/constants';
import {
  idParamSchema,
  inspectionDraftSchema,
  inspectionListSchema,
  photoCaptionSchema,
  startInspectionSchema,
} from '@v360/shared/schemas';
import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/authenticate.js';
import { uploadPhoto } from '../../middleware/uploadPhoto.js';
import { validate } from '../../middleware/validate.js';
import { addPhoto, saveDraft, submitInspection } from './inspectionDraft.service.js';
import { getInspection, listInspections, startInspection } from './inspections.service.js';

export const inspectionsRouter = Router();

const onlySalesStaff = requireRole(ROLE.SALES_STAFF);
const branchStaff = requireRole(ROLE.SALES_STAFF, ROLE.BRANCH_MANAGER);
const readId = validate(idParamSchema, 'params');

// Every inspection route needs a login; the services also check the branch (FR-AU-07).
inspectionsRouter.use(authenticate);

// Sales staff and managers: the queue of their branch.
inspectionsRouter.get(
  '/',
  branchStaff,
  validate(inspectionListSchema, 'query'),
  async (req, res) => {
    res.json({ data: await listInspections(req.user, req.valid.query.status) });
  },
);

// Sales staff: start the inspection of a received car.
inspectionsRouter.post('/', onlySalesStaff, validate(startInspectionSchema), async (req, res) => {
  res.status(201).json({ data: await startInspection(req.user, req.valid.body.vehicleId) });
});

// Sales staff and managers of the branch.
inspectionsRouter.get('/:id', branchStaff, readId, async (req, res) => {
  res.json({ data: await getInspection(req.user, req.valid.params.id) });
});

// The inspector: save the draft.
inspectionsRouter.put(
  '/:id',
  onlySalesStaff,
  readId,
  validate(inspectionDraftSchema),
  async (req, res) => {
    res.json({ data: await saveDraft(req.user, req.valid.params.id, req.valid.body) });
  },
);

// The inspector: add one photo with a caption.
inspectionsRouter.post(
  '/:id/photos',
  onlySalesStaff,
  readId,
  uploadPhoto,
  validate(photoCaptionSchema),
  async (req, res) => {
    const { id } = req.valid.params;
    res.status(201).json({ data: await addPhoto(req.user, id, req.file, req.valid.body.caption) });
  },
);

// The inspector: submit when complete.
inspectionsRouter.post('/:id/submit', onlySalesStaff, readId, async (req, res) => {
  res.json({ data: await submitInspection(req.user, req.valid.params.id) });
});
