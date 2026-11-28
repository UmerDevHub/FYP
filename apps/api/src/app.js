import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { createAuthRouter } from './modules/auth/auth.routes.js';
import { branchesRouter } from './modules/branches/branches.routes.js';
import { notificationsRouter } from './modules/notifications/notifications.routes.js';

export function createApp() {
  const app = express();
  // Safe default security headers (for example, no guessing of file types).
  app.use(helmet());
  // Only our own web app may call the API from a browser, with cookies. Any other address
  // gets no permission header, so the browser blocks it.
  app.use(cors({ origin: [env.webOrigin], credentials: true }));
  app.use(express.json());
  // Fills req.cookies: the refresh token arrives in a cookie.
  app.use(cookieParser());

  // Public.
  app.get('/api/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });

  app.use('/api/auth', createAuthRouter());
  app.use('/api/branches', branchesRouter);
  app.use('/api/notifications', notificationsRouter);

  // These two stay last: every route must be registered above them.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
