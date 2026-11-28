import { LIMITS } from '@v360/shared/constants';
import { registerSchema } from '@v360/shared/schemas';
import { Router } from 'express';
import { env } from '../../config/env.js';
import { validate } from '../../middleware/validate.js';
import { registerCustomer } from './auth.service.js';

export const authRouter = Router();

// httpOnly: page scripts cannot read it. Path: the browser only sends it to /api/auth.
function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    path: '/api/auth',
    maxAge: LIMITS.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  });
}

// Public.
authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const session = await registerCustomer(req.valid.body);
  setRefreshCookie(res, session.refreshToken);
  res.status(201).json({ data: { accessToken: session.accessToken, user: session.user } });
});
