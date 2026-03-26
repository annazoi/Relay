import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../../store/auth';
import { themeStore } from '../../store/theme';
import { HiHome, HiSearch, HiPlus, HiBell, HiUser, HiOutlineLogout, HiMoon, HiSun } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useNotificationsHook } from '../../hooks/use-notifications';

interface NavItemProps {
    to?: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick, isActive, badge }) => {
    const content = (
        <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 ${isActive
                ? 'font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}>
            <div className="relative">
                <Icon className={`w-7 h-7 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                {badge !== undefined && badge > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white dark:ring-zinc-950"
                    >
                        {badge > 9 ? '9+' : badge}
                    </motion.span>
                )}
            </div>
            <span className="text-xl hidden xl:block tracking-tight">{label}</span>
            {isActive && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full hidden xl:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </motion.div>
    );

    if (to) {
        return (
            <Link to={to} className="w-full xl:w-auto relative">
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className="w-full text-left relative">
            {content}
        </button>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isLoggedIn = authStore((state) => state.isLoggedIn);
    const userId = authStore((state) => state.userId);
    const logOut = authStore((state) => state.logOut);

    const isDark = themeStore((s) => s.isDark);
    const toggleTheme = themeStore((s) => s.toggle);

    const { unreadCount, fetchUnreadCount } = useNotificationsHook();

    useEffect(() => {
        if (!isLoggedIn) return;

        fetchUnreadCount();

        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, [isLoggedIn, fetchUnreadCount]);

    const handleLogout = () => {
        logOut();
        navigate('/login');
    };

    const navItems = [
        { to: '/home', icon: HiHome, label: 'Home', protected: true },
        { to: '/search', icon: HiSearch, label: 'Search', protected: true },
        { to: '/notifications', icon: HiBell, label: 'Notifications', badge: unreadCount, protected: true },
        { to: `/profile/${userId}`, icon: HiUser, label: 'Profile', protected: true },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex h-full">
                {/* Sidebar - Desktop */}
                {isLoggedIn && (
                    <aside className="hidden sm:flex flex-col sticky top-0 h-screen w-20 xl:w-64 border-r border-slate-100 dark:border-zinc-800 px-2 py-4 gap-2">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-[fit-content]"
                        >
                            <Link to="/home" className="p-3 mb-4 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-full w-fit block transition-all">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white uppercase italic">
                                    <span>R</span>
                                </div>
                            </Link>
                        </motion.div>

                        <div className="flex flex-col gap-1 flex-1">
                            {navItems.map((item) => {
                                if ('protected' in item && item.protected && !isLoggedIn) return null;
                                return (
                                    <NavItem
                                        key={item.label}
                                        to={item.to}
                                        icon={item.icon}
                                        label={item.label}
                                        isActive={pathname === item.to}
                                        badge={'badge' in item ? item.badge : undefined}
                                    />
                                );
                            })}

                            <NavItem
                                icon={HiOutlineLogout}
                                label="Logout"
                                onClick={handleLogout}
                            />

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 w-full text-left"
                            >
                                {isDark
                                    ? <HiSun className="w-7 h-7 text-amber-400" />
                                    : <HiMoon className="w-7 h-7" />
                                }
                                <span className="text-xl hidden xl:block tracking-tight">
                                    {isDark ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-indigo-600 text-white rounded-full py-4 px-4 xl:px-8 font-black hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs"
                        >
                            <span className="hidden xl:inline">Compose</span>
                            <HiPlus className="xl:hidden w-6 h-6 mx-auto" />
                        </motion.button>
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 w-full max-w-2xl border-r border-slate-100 dark:border-zinc-800 pb-20 sm:pb-0">
                    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 px-6 h-14 flex items-center justify-between">
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={pathname}
                            className="text-xl font-black tracking-tight text-slate-900 dark:text-white"
                        >
                            {pathname === '/home' ? 'Home' : pathname.split('/')[1]?.charAt(0).toUpperCase() + pathname.split('/')[1]?.slice(1)}
                        </motion.h1>

                        {/* Mobile theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="sm:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {isDark
                                ? <HiSun className="w-5 h-5 text-amber-400" />
                                : <HiMoon className="w-5 h-5 text-slate-500" />
                            }
                        </button>
                    </header>
                    {children}
                </main>

                {/* Right Sidebar */}
                <aside className="hidden lg:block w-80 p-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-6"
                    >
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">What's happening</h2>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="group cursor-pointer">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trending in tech</p>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">#Innovation2026</p>
                                    <p className="text-xs text-slate-500 mt-1">12.5K Posts</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </aside>
            </div>

            {/* Bottom Nav - Mobile */}
            {isLoggedIn && (
                <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-slate-100 dark:border-zinc-800 px-6 h-20 flex items-center justify-around z-50">
                    {navItems.map((item) => {
                        if ('protected' in item && item.protected && !isLoggedIn) return null;
                        const Icon = item.icon;
                        const isActive = pathname === item.to;
                        const badge = 'badge' in item ? item.badge : undefined;
                        return (
                            <Link key={item.label} to={item.to} className="relative p-2">
                                <motion.div
                                    whileTap={{ scale: 0.8 }}
                                    className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}
                                >
                                    <div className="relative">
                                        <Icon className={`w-8 h-8 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                                        {badge !== undefined && badge > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 ring-2 ring-white dark:ring-zinc-950"
                                            >
                                                {badge > 9 ? '9+' : badge}
                                            </motion.span>
                                        )}
                                    </div>
                                </motion.div>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-dot"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-400 dark:text-slate-500"
                    >
                        {isDark
                            ? <HiSun className="w-7 h-7 text-amber-400" />
                            : <HiMoon className="w-7 h-7" />
                        }
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white -mt-8 border-4 border-white dark:border-zinc-950"
                    >
                        <HiPlus className="w-8 h-8" />
                    </motion.button>
                </nav>
            )}
        </div>
    );
};
