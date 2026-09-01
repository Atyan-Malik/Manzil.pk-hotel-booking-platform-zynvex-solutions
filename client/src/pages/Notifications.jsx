import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";
import { formatDate } from "../utils/helpers";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = () => {
    getMyNotifications()
      .then((data) => setNotifications(data.notifications))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-ink">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="text-sm font-semibold text-accent-dark">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-slateline p-16 text-center">
          <Bell className="mx-auto text-muted" size={28} />
          <p className="mt-3 font-display text-lg font-semibold text-ink">You're all caught up</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`card flex items-start justify-between gap-4 p-4 ${
                !notification.isRead ? "border-accent/40 bg-accent/5" : ""
              }`}
            >
              <div>
                <p className="font-semibold text-ink">{notification.title}</p>
                <p className="mt-1 text-sm text-muted">{notification.message}</p>
                <p className="mt-2 text-xs text-muted">{formatDate(notification.createdAt)}</p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkRead(notification._id)}
                  className="shrink-0 rounded-full bg-white p-2 text-muted hover:text-accent-dark"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
