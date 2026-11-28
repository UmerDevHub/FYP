import { insertNotification } from '../modules/notifications/notifications.repository.js';
import { sendEmail } from './mailer.js';

// The one function for every notification (FR-NT-01). Services call it; routes never do.
// isEmailNeeded follows the Notification Events table of the SRDS (FR-NT-02).
export async function notify({ user, title, message, link = null, isEmailNeeded = false }) {
  await insertNotification({ userId: user.id, title, message, link });
  if (isEmailNeeded) {
    await sendEmail({ to: user.email, subject: title, text: message });
  }
}
