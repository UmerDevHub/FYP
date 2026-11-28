import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { branchesRouter } from './modules/branches/branches.routes.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/branches', branchesRouter);

  // These two stay last: every route must be registered above them.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
