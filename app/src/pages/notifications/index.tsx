import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
    HiHeart, HiChatAlt, HiUserAdd,
    HiCheckCircle, HiBell, HiRefresh,
} from 'react-icons/hi';
import { authStore } from '../../store/auth';
import { useNotificationsHook, Notification } from '../../hooks/use-notifications';
import { Spinner } from '../../components/ui/Spinner';

const notificationIconMap = {
    like: { icon: HiHeart, bg: 'bg-rose-100 dark:bg-rose-950', color: 'text-rose-500' },
    comment: { icon: HiChatAlt, bg: 'bg-sky-100 dark:bg-sky-950', color: 'text-sky-500' },
    follow: { icon: HiUserAdd, bg: 'bg-indigo-100 dark:bg-indigo-950', color: 'text-indigo-500' },
};

const notificationLink = (n: Notification): string => {
    if (n.type === 'follow') return `/profile/${n.sender._id}`;
    if (n.post) return `/post/${n.post._id}`;
    return '#';
};

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, index }) => {
    const { icon: Icon, bg, color } = notificationIconMap[notification.type];

    const handleClick = () => {
        if (!notification.read) {
            onRead(notification._id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            exit={{ opacity: 0, x: -20 }}
            layout
        >
            <Link
                to={notificationLink(notification)}
                onClick={handleClick}
                className={`flex items-start gap-4 p-4 border-b border-slate-100 dark:border-zinc-800 transition-all group relative ${notification.read
                        ? 'bg-white dark:bg-zinc-950 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50'
                        : 'bg-indigo-50/30 dark:bg-indigo-950/10 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
                    }`}
            >
                {/* Unread indicator bar */}
                {!notification.read && (
                    <motion.div
                        layoutId={`dot-${notification._id}`}
                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"
                    />
                )}

                {/* Avatar + Type icon */}
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-sm">
                        {notification.sender.image ? (
                            <img src={notification.sender.image} alt={notification.sender.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-lg text-slate-400">
                                {notification.sender.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full ${bg} flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 shadow-md`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-[15px] leading-snug ${notification.read ? 'text-slate-600 dark:text-zinc-400' : 'text-slate-900 dark:text-white'}`}>
                        <span className="font-black text-slate-900 dark:text-white hover:underline decoration-2 underline-offset-2">
                            {notification.sender.name} {notification.sender.surname}
                        </span>
                        {' '}
                        <span className={notification.read ? 'font-medium' : 'font-bold'}>
                            {notification.type === 'like' && 'liked your post'}
                            {notification.type === 'comment' && 'commented on your post'}
                            {notification.type === 'follow' && 'started following you'}
                        </span>
                    </p>

                    {notification.post && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-100/50 dark:border-zinc-800/50 text-sm italic text-slate-500 dark:text-zinc-500 line-clamp-2">
                            "{notification.post.description}"
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                            {notification.date ? formatDistanceToNow(new Date(notification.date), { addSuffix: true }) : ''}
                        </p>
                        {!notification.read && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">New</span>
                            </>
                        )}
                    </div>
                </div>

                {!notification.read && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2 shadow-lg shadow-indigo-300 dark:shadow-indigo-900" />
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="hidden group-hover:flex items-center justify-center p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRead(notification._id);
                            }}
                            title="Mark as read"
                        >
                            <HiCheckCircle className="w-4 h-4" />
                        </motion.button>
                    </div>
                )}
            </Link>
        </motion.div>
    );
};

export const Notifications: React.FC = () => {
    const isLoggedIn = authStore((s) => s.isLoggedIn);
    const { notifications, loading, unreadCount, fetchNotifications, markAllRead, markRead } = useNotificationsHook();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
        }
    }, [fetchNotifications, isLoggedIn]);

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') return notifications.filter(n => !n.read);
        return notifications;
    }, [notifications, filter]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchNotifications();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-xl shadow-indigo-100 dark:shadow-none">
                    <HiBell className="w-12 h-12 text-indigo-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Sign in to stay updated</h2>
                <p className="text-slate-500 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    Connect with others to see likes, comments, and new followers in your activity feed.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
            {/* Sticky Navigation/Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
                <div className="px-6 h-14 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Activity</h1>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none tabular-nums"
                            >
                                {unreadCount}
                            </motion.span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={loading || isRefreshing}
                            className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <HiRefresh className="w-5 h-5 text-slate-500" />
                        </button>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                <HiCheckCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Mark all read</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs/Filters */}
                <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${filter === 'all'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900'
                            }`}
                    >
                        All Activity
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${filter === 'unread'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900'
                            }`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className={`w-1.5 h-1.5 rounded-full ${filter === 'unread' ? 'bg-white' : 'bg-indigo-500'}`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Content area */}
            <div className="pb-10">
                {loading && notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Spinner loading={loading} />
                        <p className="text-xs font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest animate-pulse">
                            Syncing activity...
                        </p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-40 text-center px-8"
                    >
                        <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 dark:border-zinc-800 shadow-sm">
                            <HiBell className="w-10 h-10 text-slate-200 dark:text-zinc-800" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 italic uppercase tracking-tight">
                            {filter === 'unread' ? 'No unread activity' : 'Nothing to show'}
                        </h3>
                        <p className="text-slate-500 dark:text-zinc-500 text-sm max-w-[240px] leading-relaxed mx-auto">
                            {filter === 'unread'
                                ? "You've caught up with everything. Good job!"
                                : "Your activity feed is empty. Interact with posts to see updates here."}
                        </p>
                        {filter === 'unread' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="mt-6 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 uppercase tracking-widest"
                            >
                                View all history
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="flex flex-col">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.map((n, i) => (
                                <NotificationItem
                                    key={n._id}
                                    notification={n}
                                    onRead={markRead}
                                    index={i}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Footer message */}
                        {!loading && filteredNotifications.length > 5 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-center py-16 border-t border-slate-50 dark:border-zinc-900/50 mt-4"
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                                    <HiCheckCircle className="w-5 h-5 text-emerald-500" />
                                    <p className="font-black text-slate-400 dark:text-zinc-600 text-[10px] uppercase tracking-[0.2em] italic">
                                        End of activity history
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
