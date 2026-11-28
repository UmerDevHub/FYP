import { Router } from 'express';
import { findActiveBranches } from './branches.repository.js';

// No service file: this module has no business rule (exception in docs/progress.md).
export const branchesRouter = Router();

// Public: the sell request form needs the list of branches.
branchesRouter.get('/', async (req, res) => {
  const branches = await findActiveBranches();
  res.json({ data: branches });
});
