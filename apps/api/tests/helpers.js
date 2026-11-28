import { db } from '../src/config/db.js';

// In tests the app's own connection points at the _test database (see vitest.config.js).
export const testDb = db;

let counter = 0;

export async function makeBranch({ name = `Test branch ${++counter}`, isActive = true } = {}) {
  const [branch] = await testDb('branches')
    .insert({ name, city: 'Wah Cantt', address: 'Test address', isActive })
    .returning('*');
  return branch;
}

// The login helper comes in S2. A fake hash is enough until then.
export async function makeUser(role = 'customer', branchId = null) {
  counter += 1;
  const [user] = await testDb('users')
    .insert({
      name: `Test user ${counter}`,
      email: `user${counter}@vehicle360.test`,
      passwordHash: 'not-a-real-hash',
      role,
      branchId,
    })
    .returning('*');
  return user;
}
