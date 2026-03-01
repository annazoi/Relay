import { useCallback } from 'react';
import { useNotificationStore, Notification } from '../store/notifications';

export { type Notification };

export const useNotificationsHook = () => {
    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const loading = useNotificationStore((s) => s.loading);
    const error = useNotificationStore((s) => s.error);

    const fetchNotificationsAction = useNotificationStore((s) => s.fetchNotifications);
    const fetchUnreadCountAction = useNotificationStore((s) => s.fetchUnreadCount);
    const markAllReadAction = useNotificationStore((s) => s.markAllRead);
    const markReadAction = useNotificationStore((s) => s.markRead);

    const fetchNotifications = useCallback(() => fetchNotificationsAction(), [fetchNotificationsAction]);
    const fetchUnreadCount = useCallback(() => fetchUnreadCountAction(), [fetchUnreadCountAction]);
    const markAllRead = useCallback(() => markAllReadAction(), [markAllReadAction]);
    const markRead = useCallback((id: string) => markReadAction(id), [markReadAction]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAllRead,
        markRead,
    };
};
