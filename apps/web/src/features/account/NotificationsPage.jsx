import { Link } from 'react-router';
import { EmptyState } from '../../components/feedback.jsx';
import { Badge, Spinner } from '../../components/ui.jsx';
import { formatDateTime } from '../../lib/format.js';
import { useMarkNotificationRead, useNotifications } from './accountHooks.js';

const ROW_CLASSES = 'block w-full py-4 text-left';

function NotificationText({ notification }) {
  return (
    <>
      <span className="flex flex-wrap items-center gap-2">
        <span className={notification.isRead ? '' : 'font-semibold'}>{notification.title}</span>
        {!notification.isRead && <Badge tone="info">New</Badge>}
      </span>
      <span className="mt-1 block">{notification.message}</span>
      <span className="mt-1 block text-small text-muted">
        {formatDateTime(notification.createdAt)}
      </span>
    </>
  );
}

// Opening a notification marks it read: through its link if it has one, or by clicking it.
function NotificationRow({ notification }) {
  const markRead = useMarkNotificationRead();
  const markAsRead = () => !notification.isRead && markRead.mutate(notification.id);

  if (notification.link) {
    return (
      <Link to={notification.link} onClick={markAsRead} className={ROW_CLASSES}>
        <NotificationText notification={notification} />
      </Link>
    );
  }
  if (!notification.isRead) {
    return (
      <button type="button" onClick={markAsRead} className={ROW_CLASSES}>
        <NotificationText notification={notification} />
      </button>
    );
  }
  return (
    <div className={ROW_CLASSES}>
      <NotificationText notification={notification} />
    </div>
  );
}

// FR-NT-01: the user's own notifications, unread first (the server sorts them).
export default function NotificationsPage() {
  const notifications = useNotifications();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-title">Notifications</h1>
      {notifications.isPending && (
        <p className="mt-6 flex items-center gap-2 text-muted" role="status">
          <Spinner /> Loading your notifications.
        </p>
      )}
      {notifications.isError && (
        <p role="alert" className="mt-6 font-semibold text-fail">
          We could not load your notifications. Reload the page to try again.
        </p>
      )}
      {notifications.isSuccess && notifications.data.length === 0 && (
        <div className="mt-6">
          <EmptyState message="No notifications yet." />
        </div>
      )}
      {notifications.isSuccess && notifications.data.length > 0 && (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {notifications.data.map((notification) => (
            <li key={notification.id}>
              <NotificationRow notification={notification} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
