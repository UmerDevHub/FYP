import { LIMITS } from '@v360/shared/constants';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateMeSchema,
} from '@v360/shared/schemas';
import { Router } from 'express';
import { env } from '../../config/env.js';
import { authenticate } from '../../middleware/authenticate.js';
import { createAuthRateLimit } from '../../middleware/rateLimit.js';
import { validate } from '../../middleware/validate.js';
import {
  getMyDetails,
  logInUser,
  logOut,
  refreshSession,
  registerCustomer,
  updateMyDetails,
} from './auth.service.js';
import { changePassword, requestPasswordReset, resetPassword } from './password.service.js';

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

  // Public. Always the same answer, whether or not the e-mail has an account.
  router.post(
    '/forgot-password',
    authRateLimit,
    validate(forgotPasswordSchema),
    async (req, res) => {
      const message = await requestPasswordReset(req.valid.body.email);
      res.json({ data: { message } });
    },
  );

  // Public. The token from the e-mail link proves who is asking.
  router.post('/reset-password', authRateLimit, validate(resetPasswordSchema), async (req, res) => {
    const message = await resetPassword(req.valid.body);
    res.json({ data: { message } });
  });

  // Logged in: any role.
  router.get('/me', authenticate, async (req, res) => {
    res.json({ data: await getMyDetails(req.user.id) });
  });

  // Logged in: any role. Only name and phone change (the schema drops everything else).
  router.patch('/me', authenticate, validate(updateMeSchema), async (req, res) => {
    res.json({ data: await updateMyDetails(req.user.id, req.valid.body) });
  });

  // Logged in: any role. The refresh cookie shows which login to keep.
  router.post(
    '/change-password',
    authenticate,
    validate(changePasswordSchema),
    async (req, res) => {
      const currentToken = req.cookies[REFRESH_COOKIE_NAME];
      const message = await changePassword(req.user.id, req.valid.body, currentToken);
      res.json({ data: { message } });
    },
  );

  return router;
}
