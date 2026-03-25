import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiArrowLeft } from 'react-icons/hi';
import { usePostHook } from '../../hooks/use-posts';
import { authStore } from '../../store/auth';
import { commentSchema } from '../../validation-schemas/comment';
import { PostCard } from '../../components/PostCard';
import { Spinner } from '../../components/ui/Spinner';

interface CommentForm {
	description: string;
}

export const Post: React.FC = () => {
	const isLoggedIn = authStore((state) => state.isLoggedIn);
	const { getPost, createComment, likePost, unlikePost, loading, error } = usePostHook();
	const [post, setPost] = useState<any>(null);
	const { postId } = useParams<{ postId: string }>();
	const navigate = useNavigate();

	const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentForm>({
		defaultValues: { description: '' },
		resolver: yupResolver(commentSchema),
	});

	const fetchPost = async () => {
		if (!postId) return;
		try {
			const res = await getPost(postId);
			if (res) setPost(res);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchPost();
	}, [postId]);

	const onSubmit = async (data: CommentForm) => {
		if (!isLoggedIn) return alert('Please login first');
		try {
			const res = await createComment(data, post._id);
			if (res.message === 'ok') {
				reset();
				fetchPost();
			}
		} catch (err) {
			alert('Could not post reply');
		}
	};

	if (loading && !post) return <div className="p-10 flex justify-center"><Spinner loading={loading} /></div>;
	if (error) return <div className="p-10 text-center font-bold text-red-500">{error}</div>;
	if (!post) return null;

	return (
		<div className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950 min-h-screen transition-colors">
			<div className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 h-14 flex items-center gap-8 border-b border-slate-100 dark:border-zinc-800">
				<button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-700 dark:text-slate-300">
					<HiArrowLeft className="w-5 h-5" />
				</button>
				<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Post</h1>
			</div>

			<PostCard post={post} onLike={likePost} onUnlike={unlikePost} />

			{/* Reply Section */}
			{isLoggedIn && (
				<div className="p-4 flex gap-3 bg-white dark:bg-zinc-950">
					<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-slate-200 dark:border-zinc-700">
						<div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">U</div>
					</div>
					<form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
						<textarea
							{...register('description')}
							placeholder="Post your reply"
							className="w-full text-lg resize-none border-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-zinc-600 py-2 min-h-[60px] text-slate-900 dark:text-white font-medium bg-transparent"
						/>
						{errors.description && (
							<p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
								{errors.description.message}
							</p>
						)}
						<div className="flex justify-end pt-2 border-t border-slate-50 dark:border-zinc-800">
							<button
								type="submit"
								disabled={loading}
								className="bg-indigo-600 text-white px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-500 active:scale-95 disabled:opacity-50 transition-all"
							>
								Reply
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Comments / Thread */}
			<div className="flex flex-col">
				{post.comments?.map((comment: any) => (
					<div key={comment._id} className="p-4 border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">
						<div className="flex gap-3">
							<Link to={`/profile/${comment.creatorId._id}`} className="shrink-0">
								<div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700">
									{comment.creatorId.image ? (
										<img src={comment.creatorId.image} alt={comment.creatorId.username} className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
											{comment.creatorId.username[0].toUpperCase()}
										</div>
									)}
								</div>
							</Link>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-1 mb-1">
									<span className="font-bold text-slate-900 dark:text-white truncate hover:underline">{comment.creatorId.name}</span>
									<span className="text-slate-500 dark:text-slate-400 text-sm truncate">@{comment.creatorId.username}</span>
									<span className="text-slate-400 dark:text-zinc-600">·</span>
									<span className="text-slate-500 dark:text-slate-400 text-xs font-medium italic">Just now</span>
								</div>
								<p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed">{comment.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
