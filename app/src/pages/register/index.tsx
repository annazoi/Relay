import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { registerSchema } from '../../validation-schemas/auth';
import { useAuthHook } from '../../hooks/authHook';
import { useEffect } from 'react';
import { authStore } from '../../store/auth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImagePicker } from '../../components/ui/ImagePicker';

interface RegisterFormData {
	name: string;
	surname: string;
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	image?: string;
	bio?: string;
}

export const Register = () => {
	const logIn = authStore((store) => store.logIn);
	const { registerUser, loading, error, data } = useAuthHook();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RegisterFormData>({
		defaultValues: {
			name: '',
			surname: '',
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			image: '',
			bio: '',
		},
		resolver: yupResolver(registerSchema) as any,
	});

	useEffect(() => {
		if (!data) return;
		if (data.token) {
			logIn({
				token: data.token,
				userId: data.userId,
				image: data.image,
			});
			navigate('/home');
		}
	}, [data, logIn, navigate]);

	const onSubmit = (formData: RegisterFormData) => {
		registerUser(formData);
	};

	const handleImage = (image: string) => {
		setValue('image', image);
	};

	return (
		<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl w-full space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-zinc-700 shadow-2xl relative overflow-hidden"
			>
				<div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

				<div className="text-center">
					<h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
					<p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium italic">Join our community of innovators</p>
				</div>

				<form className="mt-8 space-y-10" onSubmit={handleSubmit(onSubmit)}>
					{/* Personal Section */}
					<div className="space-y-6">
						<h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] ml-2">Personal Identity</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input name="name" placeholder="First Name" label="First Name" register={register} error={errors.name?.message} />
							<Input name="surname" placeholder="Last Name" label="Last Name" register={register} error={errors.surname?.message} />
						</div>
						<Input name="username" placeholder="creative_mind" label="Username" register={register} error={errors.username?.message} />
						<Input name="email" type="email" placeholder="name@example.com" label="Email Address" register={register} error={errors.email?.message} />
						<div className="flex flex-col gap-1.5 w-full">
							<label className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-4 mb-1 block">Bio</label>
							<textarea
								{...register('bio')}
								placeholder="Tell us about yourself..."
								className="w-full px-6 py-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-3xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950 focus:border-indigo-400 transition-all duration-300 min-h-[100px] resize-none"
							/>
						</div>
					</div>

					{/* Security Section */}
					<div className="space-y-6">
						<h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] ml-2">Security</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input name="password" type="password" label="Password" placeholder="••••••••" register={register} error={errors.password?.message} />
							<Input name="confirmPassword" type="password" label="Confirm" placeholder="••••••••" register={register} error={errors.confirmPassword?.message} />
						</div>
					</div>

					{/* Avatar Section */}
					<div className="space-y-6 flex flex-col items-center">
						<h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Your Photo</h3>
						<ImagePicker value={watch('image')} onChange={handleImage} />
					</div>

					{error && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="p-4 bg-red-50 dark:bg-red-950/50 rounded-2xl border border-red-100 dark:border-red-900/50"
						>
							<p className="text-xs text-red-600 dark:text-red-400 font-bold">{error}</p>
						</motion.div>
					)}

					<div className="space-y-6">
						<Button className="w-full !py-4 !text-base shadow-xl shadow-indigo-200/50 uppercase tracking-widest" type="submit" loading={loading} label="Complete Registration" />
						<div className="text-center">
							<p className="text-sm font-medium text-slate-500 dark:text-slate-400">
								Already have an account?{' '}
								<Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:text-indigo-500 transition-all">
									Sign In
								</Link>
							</p>
						</div>
					</div>
				</form>
			</motion.div>
		</div>
	);
};
