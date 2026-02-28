import Button from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import Input from '../../components/ui/Input';
import { usePostHook } from '../../hooks/postHook';
import { useEffect, useState } from 'react';
import { postSchema } from '../../validation-schemas/post';
import { yupResolver } from '@hookform/resolvers/yup';
import Textarea from '../../components/ui/Textarea';
import { authStore } from '../../store/auth';
import Posts from '../../components/Posts';
import Search from '../../components/Search';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';

const Home = () => {
	const { isLoggedIn } = authStore((store) => store);
	const { createPost, getPosts, loading, error } = usePostHook();

	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: '',
			description: '',
		},
		resolver: yupResolver(postSchema),
	});

	const getAllPosts = async () => {
		try {
			const posts = await getPosts();
			if (posts) {
				setPosts(posts);
				setFilteredPosts(posts);
			}
		} catch (err) {
			console.error('Could not get Posts', err);
		}
	};

	const handleFilterChange = (event) => {
		const query = event.target.value.toLowerCase();
		setFilteredPosts(posts.filter((post) => post.title.toLowerCase().includes(query)));
	};

	useEffect(() => {
		getAllPosts();
	}, []);

	const onSubmit = async (data) => {
		try {
			if (isLoggedIn) {
				const res = await createPost(data);
				if (res.message === 'OK') {
					reset();
					getAllPosts();
				}
			} else return alert('Please log in first');
		} catch (err) {
			alert('Could not create post. Please try again later');
		}
	};

	return (
		<div className="space-y-12">
			{/* Create Post Section */}
			<section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-2xl mx-auto overflow-hidden relative">
				<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 scale-150"></div>

				<div className="relative z-10">
					<h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">New Discussion</h1>
					<p className="text-slate-500 mb-8 text-sm">
						Share your thoughts and start a conversation with the community.
					</p>

					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<Input
							name="title"
							type="text"
							placeholder="Give your post a title..."
							label="Post Title"
							register={register}
							error={errors.title?.message}
						/>
						<Textarea
							name="description"
							placeholder="What's on your mind?"
							label="Description"
							register={register}
							error={errors.description?.message}
						/>

						<div className="flex items-center justify-between pt-2">
							<Button
								type="submit"
								loading={loading && posts.length > 0}
								label="Create Post"
								className="w-full sm:w-auto"
							/>
							{!isLoggedIn && (
								<p className="text-sm text-slate-500 italic">
									Have an account?{' '}
									<Link to="/login" className="text-indigo-600 font-semibold hover:underline">
										Login
									</Link>
								</p>
							)}
						</div>

						{!isLoggedIn && (
							<div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
								<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<p className="text-xs text-indigo-700 leading-relaxed font-medium">
									You are browsing as a guest.{' '}
									<Link to="/register" className="underline font-bold">
										Register
									</Link>{' '}
									to start posting and joining the conversation.
								</p>
							</div>
						)}
					</form>
				</div>
			</section>

			{/* Posts Section */}
			<section className="space-y-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
					<div>
						<h2 className="text-2xl font-bold text-slate-900">Recent Stories</h2>
						<p className="text-slate-500 text-sm mt-1">Explore what people are talking about</p>
					</div>
					<div className="w-full md:w-auto">
						<Search onChange={handleFilterChange} />
					</div>
				</div>

				{loading ? (
					<Spinner loading={loading} />
				) : error ? (
					<div className="py-20 text-center space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-2">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold text-slate-900">{error}</h3>
						<Button label="Try Again" variant="secondary" onClick={() => getAllPosts()} />
					</div>
				) : filteredPosts.length > 0 ? (
					<Posts posts={filteredPosts} />
				) : (
					<div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-200">
						<p className="text-slate-400 font-medium">No posts found matching your search.</p>
						<Button label="View All Posts" variant="ghost" onClick={() => setFilteredPosts(posts)} />
					</div>
				)}
			</section>
		</div>
	);
};

export default Home;
