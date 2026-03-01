import { create } from "zustand";
import Axios from "axios";
import { API_URL } from "../constants";
import { authStore } from "./auth";

interface NotificationSender {
    _id: string;
    name: string;
    surname: string;
    username: string;
    image?: string;
}

interface NotificationPost {
    _id: string;
    description: string;
}

export interface Notification {
    _id: string;
    recipient: string;
    sender: NotificationSender;
    type: 'like' | 'comment' | 'follow';
    post?: NotificationPost;
    read: boolean;
    date: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAllRead: () => Promise<void>;
    markRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async () => {
        const token = authStore.getState().token;
        if (!token) return;

        try {
            set({ loading: true, error: null });
            const res = await Axios.get(`${API_URL}notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const notifications = res.data.notifications || [];
            set({ notifications, loading: false });
            
            // Re-calculate unread count from fetched notifications if needed
            // although fetching it from server is more accurate for the whole system
            const unread = notifications.filter((n: Notification) => !n.read).length;
            // Only update if it's more than or equal to current count (approximate)
            // better to fetch it 
        } catch (err) {
            set({ error: "Could not fetch notifications", loading: false });
        }
    },

    fetchUnreadCount: async () => {
        const token = authStore.getState().token;
        if (!token) return;

        try {
            const res = await Axios.get(`${API_URL}notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ unreadCount: res.data.count || 0 });
        } catch (err) {
            console.error(err);
        }
    },

    markAllRead: async () => {
        const token = authStore.getState().token;
        if (!token) return;

        try {
            await Axios.put(`${API_URL}notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            }));
        } catch (err) {
            set({ error: "Could not mark all as read" });
        }
    },

    markRead: async (id: string) => {
        const token = authStore.getState().token;
        if (!token) return;

        try {
            await Axios.put(`${API_URL}notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                notifications: state.notifications.map(n => n._id === id ? { ...n, read: true } : n),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (err) {
            set({ error: "Could not mark notification as read" });
        }
    }
}));
