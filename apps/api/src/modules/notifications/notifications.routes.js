import { idParamSchema } from '@v360/shared/schemas';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { listMyNotifications, markMyNotificationRead } from './notifications.service.js';

export const notificationsRouter = Router();

// Logged in: any role, and only their own notifications.
notificationsRouter.get('/', authenticate, async (req, res) => {
  res.json({ data: await listMyNotifications(req.user.id) });
});

// Logged in: any role, and only their own notification.
notificationsRouter.patch(
  '/:id/read',
  authenticate,
  validate(idParamSchema, 'params'),
  async (req, res) => {
    res.json({ data: await markMyNotificationRead(req.valid.params.id, req.user.id) });
  },
);
