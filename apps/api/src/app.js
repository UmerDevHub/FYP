import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });

  // These two stay last: every route must be registered above them.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
