import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const dbRes = await query('SELECT 1');
    if (dbRes) dbStatus = 'connected';
  } catch (err) {
    dbStatus = `disconnected (${err.message})`;
  }

  res.json({
    service: 'Node.js Express Server',
    status: 'online',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
