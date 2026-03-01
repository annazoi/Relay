import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authStore } from '../../store/auth';
import { HiHome, HiSearch, HiPlus, HiBell, HiUser, HiOutlineLogout } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItemProps {
    to?: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick, isActive }) => {
    const content = (
        <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 ${isActive ? 'font-black text-indigo-600 bg-indigo-50 shadow-sm shadow-indigo-100/50' : 'text-slate-700 hover:bg-slate-100'
                }`}>
            <Icon className={`w-7 h-7 ${isActive ? 'stroke-[2.5px]' : ''}`} />
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { pathname } = useLocation();
    const { isLoggedIn, userId, logOut } = authStore();

    const handleLogout = () => {
        logOut();
        window.location.href = '/login';
    };

    const navItems = [
        { to: '/home', icon: HiHome, label: 'Home' },
        { to: '/search', icon: HiSearch, label: 'Search' },
        { to: '/notifications', icon: HiBell, label: 'Notifications' },
        { to: `/profile/${userId}`, icon: HiUser, label: 'Profile', protected: true },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto flex h-full">
                {/* Sidebar - Desktop */}
                <aside className="hidden sm:flex flex-col sticky top-0 h-screen w-20 xl:w-64 border-r border-slate-100 px-2 py-4 gap-2">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link to="/home" className="p-3 mb-4 hover:bg-indigo-50 rounded-full w-fit block transition-all">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200 uppercase italic">
                                R
                            </div>
                        </Link>
                    </motion.div>

                    <div className="flex flex-col gap-1 flex-1">
                        {navItems.map((item) => {
                            if (item.protected && !isLoggedIn) return null;
                            return (
                                <NavItem
                                    key={item.label}
                                    to={item.to}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={pathname === item.to}
                                />
                            );
                        })}

                        {isLoggedIn && (
                            <NavItem
                                icon={HiOutlineLogout}
                                label="Logout"
                                onClick={handleLogout}
                            />
                        )}
                    </div>

                    {isLoggedIn && (
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-indigo-600 text-white rounded-full py-4 px-4 xl:px-8 font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
                        >
                            <span className="hidden xl:inline">Compose</span>
                            <HiPlus className="xl:hidden w-6 h-6 mx-auto" />
                        </motion.button>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-2xl border-r border-slate-100 pb-20 sm:pb-0">
                    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-14 flex items-center">
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={pathname}
                            className="text-xl font-black tracking-tight text-slate-900"
                        >
                            {pathname === '/home' ? 'Home' : pathname.split('/')[1]?.charAt(0).toUpperCase() + pathname.split('/')[1]?.slice(1)}
                        </motion.h1>
                    </header>
                    {children}
                </main>

                {/* Right Sidebar - Desktop Placeholder */}
                <aside className="hidden lg:block w-80 p-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-6"
                    >
                        <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">What's happening</h2>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="group cursor-pointer">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trending in tech</p>
                                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">#Innovation2026</p>
                                    <p className="text-xs text-slate-500 mt-1">12.5K Posts</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </aside>
            </div>

            {/* Bottom Nav - Mobile */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 h-20 flex items-center justify-around z-50">
                {navItems.map((item) => {
                    if (item.protected && !isLoggedIn) return null;
                    const Icon = item.icon;
                    const isActive = pathname === item.to;
                    return (
                        <Link key={item.label} to={item.to} className="relative p-2">
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                className={isActive ? 'text-indigo-600' : 'text-slate-400'}
                            >
                                <Icon className={`w-8 h-8 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-dot"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"
                                />
                            )}
                        </Link>
                    );
                })}
                {isLoggedIn ? (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-200 -mt-8 border-4 border-white"
                    >
                        <HiPlus className="w-8 h-8" />
                    </motion.button>
                ) : (
                    <Link to="/login" className="p-2 text-slate-400">
                        <HiOutlineLogout className="w-8 h-8" />
                    </Link>
                )}
            </nav>
        </div>
    );
};

export default Layout;
