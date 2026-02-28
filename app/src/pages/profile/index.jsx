import { useEffect, useState } from 'react';
import { usePostHook } from '../../hooks/postHook';
import { useUserHook } from '../../hooks/userHook';
import Profile from '../../components/Profile';
import Posts from '../../components/Posts';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../validation-schemas/auth';
import { useParams } from 'react-router-dom';
import ImagePicker from '../../components/ui/ImagePicker';
import Modal from '../../components/Modal';
import Form from '../../components/Form';

const ProfilePage = () => {
	const [user, setUser] = useState({});
	const [posts, setPosts] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const params = useParams();
	const { getUser, updateUser, userError, loading: userLoading } = useUserHook();
	const { getPosts, error: postError, loading: postLoading } = usePostHook();

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(registerSchema),
	});

	const getSpecificUser = async () => {
		try {
			const res = await getUser(params.creatorId);
			if (res) {
				setUser(res);
				reset({
					name: res.name,
					surname: res.surname,
					username: res.username,
					email: res.email,
					image: res.image,
				});
			}
		} catch (err) {
			console.error(err, 'Could not get User');
		}
	};

	const getAllPosts = async () => {
		try {
			const res = await getPosts(params.creatorId);
			if (res) {
				setPosts(res);
			}
		} catch (err) {
			console.error(err, 'Could not get Posts');
		}
	};

	useEffect(() => {
		getSpecificUser();
		getAllPosts();
	}, [params.creatorId]);

	const onSubmit = async (data) => {
		try {
			await updateUser(params.creatorId, data);
			setOpenModal(false);
			getSpecificUser();
			alert('Profile updated successfully!');
		} catch (err) {
			console.error('Could not update user', err);
		}
	};

	const handleImage = (image) => {
		setValue('image', image);
	};

	if (userLoading && !user._id) return <Spinner loading={userLoading} />;

	if (userError)
		return (
			<div className="py-32 text-center">
				<h2 className="text-3xl font-black text-slate-900">{userError}</h2>
				<Button label="Go Home" variant="secondary" className="mt-6" onClick={() => navigate('/home')} />
			</div>
		);

	return (
		<div className="max-w-6xl mx-auto space-y-16 pb-20 animate-in fade-in duration-700">
			{/* Profile Header Section */}
			<section className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-[4rem] -z-10"></div>
				<Profile user={user} onClick={() => setOpenModal(true)} />
			</section>

			{/* Posts Section */}
			<section className="space-y-8">
				<div className="flex items-center justify-between border-b border-slate-200 pb-6">
					<h2 className="text-3xl font-black text-slate-900 tracking-tight">
						Contributions <span className="text-indigo-600 ml-1 text-xl">({posts.length})</span>
					</h2>
				</div>

				{postLoading ? (
					<div className="flex justify-center py-20">
						<Spinner loading={postLoading} />
					</div>
				) : postError ? (
					<div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
						<p className="text-slate-400 font-bold italic">{postError}</p>
					</div>
				) : (
					<Posts posts={posts} />
				)}
			</section>

			{/* Edit Profile Modal */}
			<Modal isOpen={openModal} handlClose={setOpenModal}>
				<div className="p-2">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Profile</h2>
						<p className="text-sm text-slate-500 font-medium italic mt-2">Update your personal information</p>
					</div>

					<form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
						<div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
							<Form errors={errors} register={register} />
						</div>

						<div className="text-center space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Picture</h3>
							<ImagePicker value={getValues('image')} onChange={handleImage} />
						</div>

						<div className="flex items-center gap-4 pt-4">
							<Button
								variant="outline"
								label="Cancel"
								className="flex-1 !py-3"
								onClick={() => setOpenModal(false)}
							/>
							<Button
								label="Save Changes"
								type="submit"
								loading={userLoading}
								className="flex-1 !py-3 shadow-lg shadow-indigo-100"
							/>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
};

export default ProfilePage;
