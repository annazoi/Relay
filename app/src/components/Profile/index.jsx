import { authStore } from '../../store/auth';
import Button from '../ui/Button';
import { VscTools } from 'react-icons/vsc';

const Profile = ({ user, onClick }) => {
	const { userId } = authStore((store) => store);
	const isOwner = userId === user?._id;

	if (!user || (!user.username && !user.image)) return null;

	return (
		<div className="bg-white p-8 md:p-16 rounded-[3rem] border border-slate-200 relative overflow-hidden group">
			{/* Decorative accent */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>

			<div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16 text-center md:text-left">
				{/* Avatar */}
				<div className="relative">
					<div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] overflow-hidden border-8 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
						{user.image ? (
							<img className="w-full h-full object-cover" src={user.image} alt={user.username} />
						) : (
							<div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-7xl font-black italic">
								{user.username?.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
					{isOwner && (
						<div className="absolute -bottom-2 -right-2 transform hover:scale-110 transition-transform">
							<Button
								label={<VscTools className="w-5 h-5" />}
								onClick={onClick}
								className="!p-4 rounded-3xl !bg-indigo-600 hover:!bg-indigo-700"
							/>
						</div>
					)}
				</div>

				{/* User Info */}
				<div className="flex-1 space-y-6">
					<div className="space-y-2">
						<span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border border-indigo-100">
							Community Member
						</span>
						<h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
							{user.username}
						</h1>
						{isOwner && (
							<p className="text-xl md:text-2xl font-bold text-slate-400 italic">
								{user.name} {user.surname}
							</p>
						)}
					</div>

					{isOwner && (
						<div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-slate-100">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
									<svg
										className="w-4 h-4 text-slate-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<span className="text-sm font-bold text-slate-500 tracking-wide">{user.email}</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
