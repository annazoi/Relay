import React from 'react';
import { HiX } from 'react-icons/hi';

interface ModalProps {
    isOpen: boolean;
    handlClose: (isOpen: boolean) => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, handlClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => handlClose(false)}
            />

            {/* Content */}
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100">
                <button
                    onClick={() => handlClose(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
                >
                    <HiX className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};
