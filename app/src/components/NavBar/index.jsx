import { Link } from 'react-router-dom';
import { authStore } from '../../store/auth';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NavBar = () => {
	const { logOut, isLoggedIn, userId } = authStore((store) => store);
	const [isSelected, setSelected] = useState('');
	const { pathname } = useLocation();

	const logoutUser = () => {
		logOut();
		window.location.href = '/login';
	};

	const links = [
		{
			path: '/home',
			label: 'Home',
			protected: false,
		},
		{
			path: `/profile/${userId}`,
			label: 'Profile',
			protected: true,
		},
		{
			path: '/login',
			label: 'Login',
			protected: false,
			hideIfLoggedIn: true,
		},
		{
			label: 'Logout',
			onPress: logoutUser,
			protected: true,
		},
	];

	const onClick = (link) => {
		setSelected(link.label);
		if (link.onPress) {
			link.onPress();
		}
	};

	useEffect(() => {
		const activeLink = links.find((link) => link.path === pathname);
		if (activeLink) {
			setSelected(activeLink.label);
		}
	}, [pathname]);

	return (
		<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link to="/home" className="flex items-center gap-2 group">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
							<span className="text-white font-bold text-xl">F</span>
						</div>
						<span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
							FORUM
						</span>
					</Link>

					<div className="flex items-center gap-2">
						{links.map((link, index) => {
							const showLink =
								(link.protected && isLoggedIn) || (!link.protected && !(link.hideIfLoggedIn && isLoggedIn));

							if (!showLink) return null;

							const isActive = isSelected === link.label;

							return (
								<Link
									key={index}
									to={link.path || '#'}
									onClick={() => onClick(link)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
										isActive
											? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
											: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
									}`}
								>
									{link.label}
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
