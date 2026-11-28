import { ApiError } from '../../lib/ApiError.js';
import { findNotificationsOfUser, markNotificationOfUserRead } from './notifications.repository.js';

export function listMyNotifications(userId) {
  return findNotificationsOfUser(userId);
}

// Someone else's notification answers 404, not 403, so nobody learns that it exists.
export async function markMyNotificationRead(notificationId, userId) {
  const notification = await markNotificationOfUserRead(notificationId, userId);
  if (!notification) throw new ApiError(404, 'This notification does not exist.');
  return notification;
}
