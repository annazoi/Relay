import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	HiArrowLeft, HiOutlineCalendar, HiOutlineMail,
	HiOutlinePencilAlt, HiOutlineShare
} from 'react-icons/hi';
import { useUserHook } from '../../hooks/use-user';
import { usePostHook } from '../../hooks/use-posts';
import { authStore } from '../../store/auth';
import PostCard from '../../components/PostCard';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import ImagePicker from '../../components/ui/ImagePicker';
import Button from '../../components/ui/Button';

// Reuse existing schema or simplified version for profile update
import * as yup from 'yup';

const profileUpdateSchema = yup.object().shape({
	name: yup.string().required('First name is required'),
	surname: yup.string().required('Surname is required'),
	username: yup.string().required('Username is required'),
	email: yup.string().email('Invalid email').required('Email is required'),
	image: yup.string().optional(),
	bio: yup.string().optional(),
});

const ProfilePage: React.FC = () => {
	const { creatorId } = useParams();
	const navigate = useNavigate();
	const { userId, isLoggedIn } = authStore();
	const { getUser, followUser, unfollowUser, updateUser, loading: userLoading, userError } = useUserHook();
	const { getPosts, likePost, unlikePost, loading: postLoading } = usePostHook();

	const [user, setUser] = useState<any>(null);
	const [posts, setPosts] = useState<any[]>([]);
	const [isFollowing, setIsFollowing] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(profileUpdateSchema),
	});

	const fetchData = async () => {
		if (!creatorId) return;
		try {
			const userData = await getUser(creatorId);
			if (userData) {
				setUser(userData);
				setIsFollowing(userData.followers?.includes(userId));
				reset({
					name: userData.name,
					surname: userData.surname,
					username: userData.username,
					email: userData.email,
					image: userData.image,
					bio: userData.bio || '',
				});
			}
			const userPosts = await getPosts(creatorId);
			if (userPosts) setPosts(userPosts);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		setUser(null);
		setPosts([]);
		fetchData();
	}, [creatorId, userId]);

	const handleFollow = async () => {
		if (!isLoggedIn) return alert('Please login first');
		if (isFollowing) {
			await unfollowUser(creatorId!);
			setIsFollowing(false);
		} else {
			await followUser(creatorId!);
			setIsFollowing(true);
		}
		fetchData();
	};

	const onSubmit = async (data: any) => {
		try {
			await updateUser(creatorId!, data);
			setOpenModal(false);
			fetchData();
			alert('Profile updated successfully!');
		} catch (err) {
			console.error('Could not update user', err);
		}
	};

	const handleImage = (image: string) => {
		setValue('image', image);
	};

	if (userLoading && !user) return <div className="p-10 flex justify-center"><Spinner loading={userLoading} /></div>;
	if (userError) return <div className="p-10 text-center font-bold text-red-500">{userError}</div>;
	if (!user) return null;

	const isOwnProfile = userId === creatorId;

	return (
		<div className="flex flex-col animate-in fade-in duration-700">
			{/* Header */}
			<div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center gap-8 border-b border-slate-100">
				<button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
					<HiArrowLeft className="w-5 h-5" />
				</button>
				<div>
					<h1 className="text-xl font-bold tracking-tight text-slate-900">{user.name} {user.surname}</h1>
					<p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{posts.length} Posts</p>
				</div>
			</div>

			{/* Cover / Profile Banner Area - Enhanced with premium aesthetic */}
			<section className="relative group/banner">
				<div className="h-48 md:h-64 bg-gradient-to-br from-indigo-100 via-white to-purple-50 relative overflow-hidden">
					{/* Decorative circles from previous design */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-1000 group-hover/banner:scale-110"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

					{user.coverPhoto && <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
				</div>

				{/* Profile Info Overlayed */}
				<div className="px-6 pb-6 relative">
					<div className="flex justify-between items-end -mt-20 md:-mt-24 mb-6">
						<div className="relative group">
							<div className="w-36 h-36 md:w-44 md:h-44 rounded-[3.5rem] border-8 border-white bg-slate-100 overflow-hidden shrink-0 shadow-2xl shadow-indigo-100/50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
								{user.image ? (
									<img src={user.image} alt={user.username} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-5xl text-slate-300 font-black italic">
										{user.username[0].toUpperCase()}
									</div>
								)}
							</div>
						</div>

						<div className="flex gap-3 mb-2">
							{isOwnProfile ? (
								<button
									onClick={() => setOpenModal(true)}
									className="px-6 py-2.5 rounded-full font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
								>
									<HiOutlinePencilAlt className="w-5 h-5 text-indigo-600" />
									Edit Profile
								</button>
							) : (
								<>
									<button className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 shadow-sm active:scale-90">
										<HiOutlineShare className="w-5 h-5" />
									</button>
									<button
										onClick={handleFollow}
										className={`px-8 py-2.5 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-all ${isFollowing
											? 'border border-slate-200 bg-white text-slate-900 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50'
											: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
											}`}
									>
										{isFollowing ? 'Following' : 'Follow'}
									</button>
								</>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
									{user.name} {user.surname}
								</h2>
								<span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-indigo-100">PRO</span>
							</div>
							<p className="text-lg font-bold text-indigo-500 italic opacity-80 group-hover:opacity-100 transition-opacity">@{user.username}</p>
						</div>

						{user.bio ? (
							<p className="text-slate-700 text-[16px] leading-relaxed max-w-xl whitespace-pre-wrap py-2">
								{user.bio}
							</p>
						) : (
							<p className="text-slate-400 italic text-[15px] py-1">No bio yet...</p>
						)}

						<div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-slate-500 font-medium text-sm">
							<div className="flex items-center gap-2 group cursor-pointer hover:text-indigo-600 transition-colors">
								<HiOutlineMail className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
								<span>{user.email}</span>
							</div>
							<div className="flex items-center gap-2">
								<HiOutlineCalendar className="w-5 h-5 text-slate-400" />
								<span>Joined March 2026</span>
							</div>
						</div>

						<div className="flex gap-8 pt-4 border-t border-slate-100/50 w-full overflow-x-auto">
							<div className="hover:underline cursor-pointer group">
								<span className="text-xl font-black text-slate-900 leading-none mr-1">{user.following?.length || 0}</span>
								<span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors whitespace-nowrap">Following</span>
							</div>
							<div className="hover:underline cursor-pointer group">
								<span className="text-xl font-black text-slate-900 leading-none mr-1">{user.followers?.length || 0}</span>
								<span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors whitespace-nowrap">Followers</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Tabs - Modernized */}
			<div className="flex border-b border-slate-100 mt-2 px-4 gap-4 overflow-x-auto scrollbar-hide">
				{['Posts', 'Replies', 'Media', 'Likes'].map((tab, idx) => (
					<button
						key={tab}
						className={`py-4 px-4 font-black transition-all text-sm uppercase tracking-widest relative whitespace-nowrap ${idx === 0
							? 'text-indigo-600'
							: 'text-slate-400 hover:text-slate-600'
							}`}
					>
						{tab}
						{idx === 0 && (
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-lg shadow-indigo-100" />
						)}
					</button>
				))}
			</div>

			{/* User Feed */}
			<div className="flex flex-col bg-slate-50/30">
				{postLoading ? (
					<div className="p-20 flex justify-center"><Spinner loading={postLoading} /></div>
				) : posts.length > 0 ? (
					posts.map((post) => (
						<PostCard
							key={post._id}
							post={post}
							onLike={likePost}
							onUnlike={unlikePost}
						/>
					))
				) : (
					<div className="p-32 text-center text-slate-500">
						<p className="font-black text-2xl text-slate-200 uppercase tracking-widest italic mb-2">Ghost Town</p>
						<p className="text-sm font-medium">This user hasn't posted anything yet.</p>
					</div>
				)}
			</div>

			{/* Edit Profile Modal Restored */}
			<Modal isOpen={openModal} handlClose={setOpenModal}>
				<div className="p-2">
					<div className="text-center mb-10">
						<h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Edit Profile</h2>
						<p className="text-sm text-slate-500 font-bold uppercase tracking-[0.15em] italic mt-2 opacity-60">Redefine your social essence</p>
					</div>

					<form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
						<div className="bg-slate-50/50 p-8 md:p-10 rounded-[3.5rem] border border-slate-100 space-y-4 shadow-inner">
							<Form errors={errors} register={register} />
						</div>

						<div className="text-center space-y-6">
							<h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Profile Identity</h3>
							<ImagePicker value={getValues('image')} onChange={handleImage} />
						</div>

						<div className="flex items-center gap-4 pt-6">
							<Button
								variant="outline"
								label="Discard"
								className="flex-1 !py-4 !rounded-3xl font-bold uppercase tracking-widest text-xs border-2"
								onClick={() => setOpenModal(false)}
							/>
							<Button
								label="Refine Profile"
								type="submit"
								loading={userLoading}

								className="flex-1 !py-4 !rounded-3xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 !bg-indigo-600 transition-all hover:!bg-indigo-700 active:scale-95"
							/>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
};

export default ProfilePage;
