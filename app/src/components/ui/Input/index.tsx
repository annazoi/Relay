import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
    name: Path<T>;
    type?: string;
    placeholder?: string;
    value?: string;
    register?: UseFormRegister<T>;
    error?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Input = <T extends FieldValues>({
    name,
    type = 'text',
    placeholder,
    value,
    props,
    register,
    error,
    className = '',
    onChange,
    label,
}: InputProps<T>) => {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-1 block">{label}</label>}
            <input
                className={`w-full px-4 md:px-6 py-3.5 bg-white border border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all duration-300 ${error ? 'border-rose-400 focus:ring-rose-50 focus:border-rose-400' : ''
                    }`}
                type={type}
                placeholder={placeholder}
                value={value}
                {...props}
                {...(register ? register(name) : {})}
                onChange={(e) => {
                    if (onChange) onChange(e);
                    if (register) register(name).onChange(e);
                }}
            />
            {error && (
                <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-4 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};
