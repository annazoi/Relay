import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';
import { Input } from '../ui/Input';

interface FormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

export const Form: React.FC<FormProps> = ({ register, errors }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    name="name"
                    placeholder="First Name"
                    label="First Name"
                    register={register}
                    error={errors.name?.message as string}
                />
                <Input
                    name="surname"
                    placeholder="Surname"
                    label="Surname"
                    register={register}
                    error={errors.surname?.message as string}
                />
            </div>

            <Input
                name="username"
                placeholder="Username"
                label="Username"
                register={register}
                error={errors.username?.message as string}
            />

            <Input
                name="email"
                placeholder="Email Address"
                label="Email"
                register={register}
                error={errors.email?.message as string}
            />

            <div className="space-y-1.5 flex-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                    Bio
                </label>
                <textarea
                    {...register('bio')}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-white border border-slate-200 rounded-[2rem] p-4 md:p-6 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all min-h-[120px] resize-none"
                />
                {errors.bio && (
                    <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-4 animate-in fade-in slide-in-from-top-1">
                        {errors.bio.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};
