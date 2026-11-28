import { LIMITS } from '@v360/shared/constants';
import { loginSchema, registerSchema } from '@v360/shared/schemas';
import { Router } from 'express';
import { env } from '../../config/env.js';
import { createAuthRateLimit } from '../../middleware/rateLimit.js';
import { validate } from '../../middleware/validate.js';
import { logInUser, logOut, refreshSession, registerCustomer } from './auth.service.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

// httpOnly: page scripts cannot read it. Path: the browser only sends it to /api/auth.
// Setting and clearing use the same options, because a browser only clears a cookie that matches.
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.nodeEnv === 'production',
  path: '/api/auth',
};

function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: LIMITS.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  });
}

function sendSession(res, session, statusCode = 200) {
  setRefreshCookie(res, session.refreshToken);
  res.status(statusCode).json({ data: { accessToken: session.accessToken, user: session.user } });
}

// One router per app, so each app has its own rate-limit counter (tests build many apps).
export function createAuthRouter() {
  const router = Router();
  const authRateLimit = createAuthRateLimit();

  // Public.
  router.post('/register', authRateLimit, validate(registerSchema), async (req, res) => {
    const session = await registerCustomer(req.valid.body);
    sendSession(res, session, 201);
  });

  // Public.
  router.post('/login', authRateLimit, validate(loginSchema), async (req, res) => {
    const session = await logInUser(req.valid.body);
    sendSession(res, session);
  });

  // Needs the refresh cookie, not the access token: it is how an expired access token is replaced.
  router.post('/refresh', async (req, res) => {
    const session = await refreshSession(req.cookies[REFRESH_COOKIE_NAME]);
    sendSession(res, session);
  });

  router.post('/logout', async (req, res) => {
    await logOut(req.cookies[REFRESH_COOKIE_NAME]);
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
    res.status(204).end();
  });

  return router;
}
