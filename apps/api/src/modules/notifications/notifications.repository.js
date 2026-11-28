import { db } from '../../config/db.js';

const NOTIFICATION_COLUMNS = ['id', 'title', 'message', 'link', 'isRead', 'createdAt'];

export function insertNotification(notification) {
  return db('notifications').insert(notification);
}

// Unread first, then the newest.
export function findNotificationsOfUser(userId) {
  return db('notifications')
    .select(NOTIFICATION_COLUMNS)
    .where({ userId })
    .orderBy([{ column: 'isRead' }, { column: 'createdAt', order: 'desc' }]);
}

// The user id is part of the WHERE: a user can never change someone else's row.
export async function markNotificationOfUserRead(notificationId, userId) {
  const [notification] = await db('notifications')
    .where({ id: notificationId, userId })
    .update({ isRead: true })
    .returning(NOTIFICATION_COLUMNS);
  return notification;
}
