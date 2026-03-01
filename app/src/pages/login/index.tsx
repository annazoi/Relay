import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginSchema } from '../../validation-schemas/auth';
import { useAuthHook } from '../../hooks/authHook';
import { useEffect } from 'react';
import { authStore } from '../../store/auth';
import { Link, useNavigate } from 'react-router-dom';

interface LoginFormData {
	email: string;
	password: string;
}

export const Login = () => {
	const { logIn } = authStore((store) => store);
	const { loginUser, loading, error, data } = useAuthHook();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginSchema),
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

	const onSubmit = (formData: LoginFormData) => {
		try {
			loginUser(formData);
		} catch (err) {
			console.error('Could not login', err);
		}
	};

	return (
		<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in zoom-in duration-500">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 mb-6">
						<span className="text-white text-3xl font-black">R</span>
					</div>
					<h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
					<p className="mt-2 text-sm text-slate-500 font-medium italic">Sign in to continue the conversation</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-4">
						<Input
							name="email"
							type="text"
							placeholder="name@example.com"
							label="Email Address"
							register={register}
							error={errors.email?.message}
						/>
						<Input
							name="password"
							type="password"
							placeholder="••••••••"
							label="Password"
							register={register}
							error={errors.password?.message}
						/>
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

					<Button
						className="w-full !py-3 !text-base shadow-lg shadow-indigo-200"
						type="submit"
						loading={loading}
						label="Sign In"
					/>
				</form>

				<div className="mt-8 text-center pt-8 border-t border-slate-100">
					<p className="text-sm font-medium text-slate-500">
						Don't have an account?{' '}
						<Link
							to="/register"
							className="text-indigo-600 font-black hover:text-indigo-500 hover:underline underline-offset-4 decoration-2 decoration-indigo-200 transition-all"
						>
							Register now
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

