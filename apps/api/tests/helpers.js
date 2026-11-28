import { createDb } from '../src/config/db.js';
import { loadEnv } from '../src/config/env.js';

export const testDb = createDb(loadEnv().testDatabaseUrl);

let counter = 0;

export async function makeBranch(name = `Test branch ${++counter}`) {
  const [branch] = await testDb('branches')
    .insert({ name, city: 'Wah Cantt', address: 'Test address' })
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
