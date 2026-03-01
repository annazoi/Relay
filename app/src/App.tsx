import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Profile } from './pages/profile';
import { Layout } from './components/Layout';
import { Home } from './pages/home';
import { Post } from './pages/post';
import { Notifications } from './pages/notifications';
import { AnimatePresence, motion } from 'framer-motion';
import { themeStore } from './store/theme';

function AppContent() {
	const location = useLocation();

	return (
		<Layout>
			<AnimatePresence mode="wait">
				<motion.div
					key={location.pathname}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<Routes location={location}>
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile/:creatorId" element={<Profile />} />
						<Route path="/post/:postId" element={<Post />} />
						<Route path="/notifications" element={<Notifications />} />
						<Route path="/*" element={<Navigate to="/login" />} />
					</Routes>
				</motion.div>
			</AnimatePresence>
		</Layout>
	);
}

export const App = () => {
	const isDark = themeStore((s) => s.isDark);

	useEffect(() => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [isDark]);

	return (
		<div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-700 dark:selection:text-indigo-200 transition-colors duration-300">
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</div>
	);
};
