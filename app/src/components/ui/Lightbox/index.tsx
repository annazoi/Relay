import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiDownload, HiExternalLink } from 'react-icons/hi';
import { createPortal } from 'react-dom';

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
    alt?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, src, alt }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
                onClick={onClose}
            >
                {/* Controls */}
                <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]" onClick={e => e.stopPropagation()}>
                    <a 
                        href={src} 
                        download 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10"
                        title="Open original"
                    >
                        <HiExternalLink className="w-5 h-5" />
                    </a>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Image Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative max-w-full max-h-full flex items-center justify-center p-4 ring-1 ring-white/10 rounded-2xl bg-white/[0.02]"
                    onClick={e => e.stopPropagation()}
                >
                    <img
                        src={src}
                        alt={alt || "Full screen preview"}
                        className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
                    />
                    
                    {/* Subtle glow behind image */}
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] -z-10" />
                </motion.div>

                {/* Key listener (esc) */}
                <EventListener onClose={onClose} />
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

const EventListener = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);
    return null;
};
