import request from 'supertest';
import { createApp } from '../src/app.js';
import { db } from '../src/config/db.js';
import { hashPassword } from '../src/lib/password.js';

// Every test user has this password. It is hashed once, because bcrypt is slow on purpose.
export const TEST_PASSWORD = 'testpass123';
const testPasswordHash = await hashPassword(TEST_PASSWORD);

// In tests the app's own connection points at the _test database (see vitest.config.js).
export const testDb = db;

let counter = 0;

export async function makeBranch({ name = `Test branch ${++counter}`, isActive = true } = {}) {
  const [branch] = await testDb('branches')
    .insert({ name, city: 'Wah Cantt', address: 'Test address', isActive })
    .returning('*');
  return branch;
}

// A user who can log in with TEST_PASSWORD.
export async function makeUser(role = 'customer', branchId = null) {
  counter += 1;
  const [user] = await testDb('users')
    .insert({
      name: `Test user ${counter}`,
      email: `user${counter}@vehicle360.test`,
      passwordHash: testPasswordHash,
      role,
      branchId,
    })
    .returning('*');
  return user;
}

// Logs in through the real route, like a browser does. Every request made with the returned agent
// carries the access token, and the agent keeps the refresh cookie. Later slices use this.
export async function logInAs(user) {
  const agent = request.agent(createApp());
  const response = await agent
    .post('/api/auth/login')
    .send({ email: user.email, password: TEST_PASSWORD });
  if (response.status !== 200) throw new Error(`Test login failed: ${response.status}`);
  agent.set('Authorization', `Bearer ${response.body.data.accessToken}`);
  return agent;
}
