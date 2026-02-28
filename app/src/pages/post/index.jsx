import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { usePostHook } from '../../hooks/postHook';
import { authStore } from '../../store/auth';
import { commentSchema } from '../../validation-schemas/comment';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import Comments from '../../components/Comment';
import Post from '../../components/Posts/Post';
import Spinner from '../../components/ui/Spinner';

const PostPage = () => {
	const { isLoggedIn, userId } = authStore((store) => store);
	const { getPost, deletePost, createComment, error, loading } = usePostHook();
	const [postData, setPostData] = useState({});
	const navigate = useNavigate();
	const params = useParams();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			description: '',
		},
		resolver: yupResolver(commentSchema),
	});

	const specificPost = async () => {
		try {
			const res = await getPost(params.postId);
			if (res) {
				setPostData(res);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		specificPost();
	}, [params.postId]);

	const removePost = async () => {
		if (window.confirm('Are you sure you want to delete this post?')) {
			if (postData.creatorId && userId === postData.creatorId._id) {
				const response = await deletePost(postData._id);
				if (response.deleted) {
					navigate('/home');
				}
			} else {
				alert('You can only delete your own posts.');
			}
		}
	};

	const onSubmit = async (data) => {
		try {
			if (isLoggedIn) {
				await createComment(data, postData._id);
				reset();
				specificPost();
			} else {
				alert('Please log in to comment.');
			}
		} catch (err) {
			console.error('Could not create comment', err);
		}
	};

	if (loading && !postData._id) return <Spinner loading={loading} />;

	if (error)
		return (
			<div className="py-32 text-center space-y-6">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-500 rounded-full mb-4">
					<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 className="text-3xl font-bold text-slate-900">{error}</h2>
				<Button label="Go back Home" variant="secondary" onClick={() => navigate('/home')} />
			</div>
		);

	return (
		<div className="max-w-4xl mx-auto space-y-12 pb-20">
			<div className="mb-8">
				<Link
					to="/home"
					className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to Discussions
				</Link>
			</div>

			<Post post={postData} onClick={removePost} />

			<section className="space-y-8">
				<div className="flex items-center justify-between border-b border-slate-200 pb-6">
					<h2 className="text-2xl font-bold text-slate-900">
						Comments <span className="text-indigo-600 ml-1">{postData.comments?.length || 0}</span>
					</h2>
				</div>

				{/* Comment Form */}
				<div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
					<h3 className="text-lg font-bold text-slate-900 mb-6">Leave a comment</h3>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<Textarea
							name="description"
							placeholder={isLoggedIn ? 'Join the conversation...' : 'You must be logged in to comment.'}
							register={register}
							disabled={!isLoggedIn}
							error={errors.description?.message}
						/>
						<div className="flex justify-end">
							{isLoggedIn ? (
								<Button type="submit" loading={loading} label="Post Comment" />
							) : (
								<div className="flex items-center gap-3">
									<span className="text-sm text-slate-500 font-medium italic underline underline-offset-4 decoration-indigo-200">
										Connect to join the community
									</span>
									<Link to="/login">
										<Button label="Login" variant="secondary" />
									</Link>
								</div>
							)}
						</div>
					</form>
				</div>

				{/* Comments List */}
				<div className="mt-8">
					<Comments comments={postData.comments} />
				</div>
			</section>
		</div>
	);
};

export default PostPage;
