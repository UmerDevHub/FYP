import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { logInAs, makeBranch, makeUser, TEST_PASSWORD, testDb } from './helpers.js';

describe('GET and PATCH /api/auth/me (FR-AU-05)', () => {
  it('a logged-in user reads their own details, without the password hash', async () => {
    const user = await makeUser('customer');
    const agent = await logInAs(user);

    const response = await agent.get('/api/auth/me');

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ id: user.id, email: user.email, role: 'customer' });
    expect(response.body.data).not.toHaveProperty('passwordHash');
  });

  it('without a token the answer is 401', async () => {
    expect((await request(createApp()).get('/api/auth/me')).status).toBe(401);
  });

  it('updates the name and phone, and ignores a role, branch or e-mail in the body', async () => {
    const branch = await makeBranch();
    const user = await makeUser('customer');
    const agent = await logInAs(user);

    const response = await agent.patch('/api/auth/me').send({
      name: 'New Name',
      phone: '0333-7654321',
      role: 'admin',
      branchId: branch.id,
      email: 'taken-over@example.com',
    });

    expect(response.status).toBe(200);
    const saved = await testDb('users').where({ id: user.id }).first();
    expect(saved).toMatchObject({
      name: 'New Name',
      phone: '03337654321',
      role: 'customer',
      branchId: null,
      email: user.email,
    });
  });
});

describe('POST /api/auth/change-password (FR-AU-05)', () => {
  it('refuses a wrong old password and keeps the old one', async () => {
    const user = await makeUser('customer');
    const agent = await logInAs(user);

    const response = await agent
      .post('/api/auth/change-password')
      .send({ oldPassword: 'not-the-password1', newPassword: 'brandnew12' });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Your old password is not right.');
    await logInAs(user);
  });

  it('changes the password and ends the other logins, but keeps this one', async () => {
    const user = await makeUser('customer');
    const thisDevice = await logInAs(user);
    const otherDevice = await logInAs(user);

    const response = await thisDevice
      .post('/api/auth/change-password')
      .send({ oldPassword: TEST_PASSWORD, newPassword: 'brandnew12' });

    expect(response.status).toBe(200);
    expect((await otherDevice.post('/api/auth/refresh')).status).toBe(401);
    expect((await thisDevice.post('/api/auth/refresh')).status).toBe(200);
    const login = await request(createApp())
      .post('/api/auth/login')
      .send({ email: user.email, password: 'brandnew12' });
    expect(login.status).toBe(200);
  });
});
