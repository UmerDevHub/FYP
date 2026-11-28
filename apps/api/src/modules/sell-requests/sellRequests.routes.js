import { ROLE } from '@v360/shared/constants';
import {
  idParamSchema,
  rejectSellRequestSchema,
  sellRequestListSchema,
  sellRequestSchema,
} from '@v360/shared/schemas';
import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import {
  acceptSellRequest,
  createSellRequest,
  getSellRequest,
  listBranchSellRequests,
  listMySellRequests,
  rejectSellRequest,
} from './sellRequests.service.js';

export const sellRequestsRouter = Router();

// Every sell request route needs a login.
sellRequestsRouter.use(authenticate);

// Customer.
sellRequestsRouter.post(
  '/',
  requireRole(ROLE.CUSTOMER),
  validate(sellRequestSchema),
  async (req, res) => {
    res.status(201).json({ data: await createSellRequest(req.user.id, req.valid.body) });
  },
);

// Customer. A path without a number comes before '/:id', or "mine" would be read as an id.
sellRequestsRouter.get('/mine', requireRole(ROLE.CUSTOMER), async (req, res) => {
  res.json({ data: await listMySellRequests(req.user.id) });
});

// Sales staff and managers: their own branch only.
sellRequestsRouter.get(
  '/',
  requireRole(ROLE.SALES_STAFF, ROLE.BRANCH_MANAGER),
  validate(sellRequestListSchema, 'query'),
  async (req, res) => {
    res.json({ data: await listBranchSellRequests(req.user, req.valid.query.status) });
  },
);

// The owner, or staff of the branch (the service checks which).
sellRequestsRouter.get('/:id', validate(idParamSchema, 'params'), async (req, res) => {
  res.json({ data: await getSellRequest(req.user, req.valid.params.id) });
});

// Manager of the branch.
sellRequestsRouter.post(
  '/:id/accept',
  requireRole(ROLE.BRANCH_MANAGER),
  validate(idParamSchema, 'params'),
  async (req, res) => {
    res.json({ data: await acceptSellRequest(req.user, req.valid.params.id) });
  },
);

// Manager of the branch.
sellRequestsRouter.post(
  '/:id/reject',
  requireRole(ROLE.BRANCH_MANAGER),
  validate(idParamSchema, 'params'),
  validate(rejectSellRequestSchema),
  async (req, res) => {
    const { id } = req.valid.params;
    res.json({ data: await rejectSellRequest(req.user, id, req.valid.body.reason) });
  },
);
