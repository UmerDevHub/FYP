import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { sentEmails } from '../src/lib/mailer.js';
import { notify } from '../src/lib/notify.js';
import { logInAs, makeUser, testDb } from './helpers.js';

describe('notify (FR-NT-01, FR-NT-02)', () => {
  it('creates an in-app notification for the user', async () => {
    const user = await makeUser('customer');

    await notify({
      user,
      title: 'Sell request accepted',
      message: 'Branch 1 accepted your request.',
    });

    const rows = await testDb('notifications').where({ userId: user.id });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ title: 'Sell request accepted', isRead: false });
  });

  it('also sends an e-mail when the event asks for one', async () => {
    const user = await makeUser('customer');

    await notify({
      user,
      title: 'Sell request accepted',
      message: 'Branch 1 accepted your request.',
      isEmailNeeded: true,
    });

    expect(sentEmails.findLast((sent) => sent.to === user.email).subject).toBe(
      'Sell request accepted',
    );
  });
});

describe('GET /api/notifications', () => {
  it('lists only my own notifications, unread first', async () => {
    const me = await makeUser('customer');
    const someoneElse = await makeUser('customer');
    await notify({ user: me, title: 'Old news', message: 'Read already.' });
    await testDb('notifications').where({ userId: me.id }).update({ isRead: true });
    await notify({ user: me, title: 'New news', message: 'Not read yet.' });
    await notify({ user: someoneElse, title: 'Not mine', message: 'For someone else.' });

    const response = await (await logInAs(me)).get('/api/notifications');

    expect(response.status).toBe(200);
    expect(response.body.data.map((row) => row.title)).toEqual(['New news', 'Old news']);
  });

  it('without a token the answer is 401', async () => {
    expect((await request(createApp()).get('/api/notifications')).status).toBe(401);
  });
});

describe('PATCH /api/notifications/:id/read', () => {
  it('marks my own notification as read', async () => {
    const me = await makeUser('customer');
    await notify({ user: me, title: 'Hello', message: 'Read me.' });
    const [notification] = await testDb('notifications').where({ userId: me.id });

    const response = await (await logInAs(me)).patch(`/api/notifications/${notification.id}/read`);

    expect(response.status).toBe(200);
    expect(response.body.data.isRead).toBe(true);
  });

  it("another user's notification gives 404, as if it did not exist, and stays unread", async () => {
    const owner = await makeUser('customer');
    const intruder = await makeUser('customer');
    await notify({ user: owner, title: 'Private', message: 'Only for the owner.' });
    const [notification] = await testDb('notifications').where({ userId: owner.id });

    const response = await (
      await logInAs(intruder)
    ).patch(`/api/notifications/${notification.id}/read`);

    expect(response.status).toBe(404);
    const unchanged = await testDb('notifications').where({ id: notification.id }).first();
    expect(unchanged.isRead).toBe(false);
  });

  it('an id that is not a number gives 400', async () => {
    const me = await makeUser('customer');

    const response = await (await logInAs(me)).patch('/api/notifications/abc/read');

    expect(response.status).toBe(400);
  });
});
