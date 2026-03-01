import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiOutlinePhotograph, HiOutlineEmojiHappy } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostHook } from '../../hooks/use-posts';
import { authStore } from '../../store/auth';
import { postSchema } from '../../validation-schemas/post';
import { PostCard } from '../../components/PostCard';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

interface PostForm {
	description: string;
}

export const Home: React.FC = () => {
	const isLoggedIn = authStore((state) => state.isLoggedIn);
	const image = authStore((state) => state.image);

	const { createPost, getPosts, likePost, unlikePost, loading } = usePostHook();

	const [posts, setPosts] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PostForm>({
		defaultValues: {
			description: '',
		},
		resolver: yupResolver(postSchema),
	});

	const description = watch('description');

	const fetchPosts = useCallback(async (pageNum: number, isInitial = false) => {
		try {
			const newPosts = await getPosts("", pageNum);
			if (newPosts && Array.isArray(newPosts)) {
				if (newPosts.length < 10) setHasMore(false);
				if (isInitial) {
					setPosts(newPosts);
				} else {
					setPosts(prev => [...prev, ...newPosts]);
				}
			} else {
				setHasMore(false);
			}
		} catch (err) {
			console.error('Error fetching posts', err);
			setHasMore(false);
		}
	}, [getPosts]);

	useEffect(() => {
		fetchPosts(1, true);
	}, [fetchPosts]);

	const handleScroll = useCallback(() => {
		if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !loading && hasMore) {
			setPage(prev => {
				const next = prev + 1;
				fetchPosts(next);
				return next;
			});
		}
	}, [loading, hasMore, fetchPosts]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	const onSubmit = async (data: PostForm) => {
		if (!isLoggedIn) return alert('Please login first');
		try {
			const res = await createPost(data);
			if (res) {
				reset();
				fetchPosts(1, true);
				setPage(1);
				setHasMore(true);
			}
		} catch (err) {
			alert('Could not create post');
		}
	};

	return (
		<div className="bg-white min-h-screen">
			{isLoggedIn && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-6 border-b border-slate-100 bg-white"
				>
					<div className="flex gap-4">
						<div className="w-14 h-14 rounded-full bg-slate-100 shrink-0 overflow-hidden shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-xl italic border border-slate-200">
							{image ? (
								<img src={image} alt="Profile" className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
							)}
						</div>
						<form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
							<textarea
								{...register('description')}
								placeholder="What's happening?!"
								className="w-full text-xl md:text-2xl resize-none border-none focus:ring-0 placeholder:text-slate-300 py-2 min-h-[120px] text-slate-900 font-medium"
							/>

							<AnimatePresence>
								{errors.description && (
									<motion.p
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1"
									>
										{errors.description.message}
									</motion.p>
								)}
							</AnimatePresence>

							<motion.div
								layout
								className="flex items-center justify-between pt-4 border-t border-slate-50"
							>
								<div className="flex gap-1">
									<button type="button" className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-90">
										<HiOutlinePhotograph className="w-6 h-6" />
									</button>
									<button type="button" className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-90">
										<HiOutlineEmojiHappy className="w-6 h-6" />
									</button>
								</div>

								<Button
									label="Publish"
									type="submit"
									disabled={loading || !description}
									loading={loading}
									className="!px-10 !py-3 !rounded-full !font-black !uppercase !tracking-widest !text-xs !bg-indigo-600 !shadow-xl !shadow-indigo-100 hover:!bg-indigo-700 active:!scale-95 disabled:!opacity-30 disabled:!bg-slate-300 disabled:!shadow-none transition-all"
								/>
							</motion.div>
						</form>
					</div>
				</motion.div>
			)}

			{/* Feed */}
			<div className="flex flex-col bg-slate-50/20">
				<AnimatePresence mode="popLayout">
					{posts.map((post, index) => (
						<motion.div
							key={post._id}
							initial={{ opacity: 0, x: -10 }}
							animate={{
								opacity: 1,
								x: 0,
								transition: { delay: index * 0.05, duration: 0.4 }
							}}
							viewport={{ once: true }}
						>
							<PostCard
								post={post}
								onLike={likePost}
								onUnlike={unlikePost}
							/>
						</motion.div>
					))}
				</AnimatePresence>

				{loading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="p-16 flex justify-center"
					>
						<Spinner loading={loading} />
					</motion.div>
				)}

				{!hasMore && posts.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="p-20 text-center py-32"
					>
						<p className="font-black text-slate-200 text-3xl uppercase tracking-[0.2em] italic mb-4">You're all caught up</p>
						<div className="w-12 h-1 bg-indigo-500 mx-auto rounded-full opacity-20" />
					</motion.div>
				)}
			</div>
		</div>
	);
};

