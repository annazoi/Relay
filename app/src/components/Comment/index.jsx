import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import Button from '../ui/Button';
import { authStore } from '../../store/auth';
import { VscTrash } from 'react-icons/vsc';

const Comments = ({ comments, onClick }) => {
	const { userId } = authStore((store) => store);

	if (!comments || comments.length === 0) {
		return (
			<div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
				<p className="text-slate-400 font-medium italic">No comments yet. Be the first to share your thoughts!</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{comments.map((comment, index) => {
				const isOwner = comment.creatorId && userId === comment.creatorId._id;

				return (
					<div key={index} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className="shrink-0">
							<Link to={`/profile/${comment.creatorId._id}`}>
								<div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-white hover:scale-105 transition-transform">
									{comment.creatorId.image ? (
										<img
											className="w-full h-full object-cover"
											src={comment.creatorId.image}
											alt={comment.creatorId.username}
										/>
									) : (
										<div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
											{comment.creatorId.username?.charAt(0).toUpperCase()}
										</div>
									)}
								</div>
							</Link>
						</div>

						<div className="flex-1 space-y-1">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Link
										to={`/profile/${comment.creatorId._id}`}
										className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
									>
										@{comment.creatorId.username}
									</Link>
									<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
										{formatDate(comment.date)}
									</span>
								</div>

								{isOwner && (
									<Button
										variant="ghost"
										className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-50 !p-1.5 rounded-lg transition-all"
										label={<VscTrash className="w-4 h-4" />}
										onClick={() => onClick && onClick(comment._id)}
									/>
								)}
							</div>

							<div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none">
								<p className="text-slate-600 text-sm md:text-base leading-relaxed">{comment.description}</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Comments;
