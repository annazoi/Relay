import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../components/ui/Button';
import { registerSchema } from '../../validation-schemas/auth';
import { useAuthHook } from '../../hooks/authHook';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ImagePicker from '../../components/ui/ImagePicker';
import Form from '../../components/Form';
import { authStore } from '../../store/auth';

const Register = () => {
	const { logIn } = authStore((store) => store);
	const { registerUser, loading, error, data } = useAuthHook();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			surname: '',
			username: '',
			password: '',
			confirmPassword: '',
			image: '',
		},
		resolver: yupResolver(registerSchema),
	});

	useEffect(() => {
		if (!data) return;
		if (data.token) {
			logIn({
				token: data.token,
				userId: data.userId,
			});
			navigate('/home');
		}
	}, [data]);

	const onSubmit = (data) => {
		try {
			registerUser(data);
		} catch (err) {
			console.error('Registration error', err);
		}
	};

	const handleImage = (image) => {
		setValue('image', image);
	};

	return (
		<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in zoom-in duration-500">
			<div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 mb-6">
						<span className="text-white text-3xl font-black">F</span>
					</div>
					<h2 className="text-3xl font-black text-slate-900 tracking-tight">Join Our Community</h2>
					<p className="mt-2 text-sm text-slate-500 font-medium italic">
						Create an account to start sharing your stories
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
						<div className="md:col-span-2">
							<h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Personal Info</h3>
						</div>
						<Form errors={errors} register={register} />
					</div>

					<div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center hover:border-indigo-300 transition-colors group">
						<h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Your Photo</h3>
						<ImagePicker onChange={handleImage} />
						<p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
							Click to select avatar
						</p>
					</div>

					{error && (
						<div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
							<svg
								className="w-5 h-5 text-red-500 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p className="text-xs text-red-600 font-bold">{error}</p>
						</div>
					)}

					<div className="pt-4">
						<Button
							type="submit"
							loading={loading}
							label="Create My Account"
							className="w-full !py-4 !text-lg shadow-xl shadow-indigo-200"
						/>
					</div>
				</form>

				<div className="mt-8 text-center pt-8 border-t border-slate-100">
					<p className="text-sm font-medium text-slate-500">
						Already have an account?{' '}
						<Link
							to="/login"
							className="text-indigo-600 font-black hover:text-indigo-500 hover:underline underline-offset-4 decoration-2 decoration-indigo-200 transition-all"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
