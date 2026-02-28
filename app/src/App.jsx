import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import NavBar from './components/NavBar';
import Home from './pages/home';
import Post from './pages/post';

function App() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
			<BrowserRouter>
				<NavBar />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<Routes>
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile/:creatorId" element={<Profile />} />
						<Route path="/post/:postId" element={<Post />} />
						<Route path="/*" element={<Navigate to="/home" />} />
					</Routes>
				</main>
			</BrowserRouter>
		</div>
	);
}

export default App;
