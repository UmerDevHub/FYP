import { ROLE } from '@v360/shared/constants';
import { arrivalSchema } from '@v360/shared/schemas';
import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { recordArrival } from './vehicles.service.js';

export const vehiclesRouter = Router();

// Paths without a number (/arrivals, and later /manage and /stock) come before '/:id'.

// Sales staff: record the arrival of a car at their own branch.
vehiclesRouter.post(
  '/arrivals',
  authenticate,
  requireRole(ROLE.SALES_STAFF),
  validate(arrivalSchema),
  async (req, res) => {
    res.status(201).json({ data: await recordArrival(req.user, req.valid.body) });
  },
);
