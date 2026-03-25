import { authStore } from '../../../store/auth';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import { formatDate } from '../../../utils/date';
import { VscTrash } from 'react-icons/vsc';

const Post = ({ post, onClick }) => {
	const { userId } = authStore((store) => store);

	if (!post || !post.title) return null;

	const isOwner = post.creatorId && userId === post.creatorId._id;

	return (
		<div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
			{/* Decorative background element */}
			<div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-700"></div>

			<div className="relative z-10">
				<div className="flex justify-between items-start mb-8">
					<div>
						<span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
							Community Story
						</span>
						<h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
							{post.title}
						</h1>
					</div>

					{isOwner && (
						<Button
							variant="ghost"
							className="text-red-500 hover:bg-red-50 hover:text-red-600 !p-3 rounded-2xl"
							label={<VscTrash className="w-6 h-6" />}
							onClick={onClick}
						/>
					)}
				</div>

				<div className="prose prose-slate max-w-none">
					<p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">{post.description}</p>
				</div>

				<div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl border border-white">
							{post?.creatorId?.username?.charAt(0).toUpperCase() || 'U'}
						</div>
						<div>
							<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Author</p>
							<Link
								to={`/profile/${post?.creatorId?._id}`}
								className="text-slate-900 font-bold hover:text-indigo-600 transition-colors"
							>
								@{post?.creatorId?.username}
							</Link>
						</div>
					</div>

					<div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
						<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-sm font-bold text-slate-500 tracking-wide">{formatDate(post?.date)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
