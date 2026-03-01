import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Layout from './components/Layout';
import Home from './pages/home';
import Post from './pages/post';
import { AnimatePresence, motion } from 'framer-motion';

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
						<Route path="/*" element={<Navigate to="/home" />} />
					</Routes>
				</motion.div>
			</AnimatePresence>
		</Layout>
	);
}

function App() {
	return (
		<div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</div>
	);
}

export default App;
