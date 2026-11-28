import { db } from '../../config/db.js';

// Public list: name the columns, so a new private column never leaks out.
export function findActiveBranches() {
  return db('branches').select(['id', 'name', 'city']).where({ isActive: true }).orderBy('id');
}
