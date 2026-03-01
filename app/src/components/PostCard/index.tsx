import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
    HiOutlineHeart, HiHeart, HiOutlineChatAlt,
    HiOutlineShare, HiOutlineDotsHorizontal,
    HiArrowsExpand
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { authStore } from '../../store/auth';
import { Lightbox } from '../ui/Lightbox';

interface PostCardProps {
    post: {
        _id: string;
        description: string;
        image?: string;
        date: string;
        likes: string[];
        comments: any[];
        creatorId: {
            _id: string;
            username: string;
            image?: string;
            name?: string;
            surname?: string;
        };
    };
    onLike: (id: string) => void;
    onUnlike: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onUnlike }) => {
    const { userId } = authStore();
    const isLiked = post.likes.includes(userId || '');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const username = post.creatorId?.username || 'user';
    const name = post.creatorId?.name || 'User';
    const surname = post.creatorId?.surname || '';

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 border-b border-slate-100 dark:border-zinc-800 transition-colors group cursor-pointer relative hover:bg-slate-50/50 dark:hover:bg-zinc-900/50"
            >
                <div className="flex gap-3">
                    {/* Avatar */}
                    <Link to={`/profile/${post.creatorId?._id}`} className="shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700"
                        >
                            {post.creatorId?.image ? (
                                <img src={post.creatorId.image} alt={username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                    {username[0].toUpperCase()}
                                </div>
                            )}
                        </motion.div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1 group/author min-w-0">
                                <Link to={`/profile/${post.creatorId?._id}`} className="font-bold text-slate-900 dark:text-white hover:underline truncate" onClick={(e) => e.stopPropagation()}>
                                    {name} {surname}
                                </Link>
                                <span className="text-slate-500 dark:text-slate-400 truncate text-sm">@{username}</span>
                                <span className="text-slate-400 dark:text-slate-600">·</span>
                                <span className="text-slate-400 dark:text-slate-500 text-sm whitespace-nowrap">
                                    {post.date ? formatDistanceToNow(new Date(post.date)) : ''}
                                </span>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-full transition-all sm:opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                <HiOutlineDotsHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <Link to={`/post/${post._id}`} className="block mt-1">
                            <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-normal whitespace-pre-wrap break-words">
                                {post.description}
                            </p>

                            {post.image && (
                                <div className="mt-3 relative group/image overflow-hidden rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative"
                                    >
                                        <img src={post.image} alt="Post" className="w-full h-auto max-h-[512px] object-cover" />
                                        
                                        {/* Overlay for Expand Icon */}
                                        <div 
                                            className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors flex items-center justify-center pointer-events-none"
                                        >
                                            <motion.button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setIsLightboxOpen(true);
                                                }}
                                                className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-md border border-white/20 opacity-0 group-hover/image:opacity-100 pointer-events-auto shadow-xl"
                                                initial={{ y: 10 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                animate={{ y: 0 }}
                                            >
                                                <HiArrowsExpand className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Subtle vignette on image */}
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
                                </div>
                            )}
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
                            <Link to={`/post/${post._id}`} className="flex items-center gap-2 group/action p-2 rounded-full hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors" onClick={(e) => e.stopPropagation()}>
                                <div className="p-1 rounded-full text-slate-500 dark:text-slate-400 group-hover/action:text-sky-500 transition-colors">
                                    <HiOutlineChatAlt className="w-5 h-5" />
                                </div>
                                <span className="text-sm text-slate-500 dark:text-slate-400 group-hover/action:text-sky-500">
                                    {post.comments?.length || 0}
                                </span>
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    isLiked ? onUnlike(post._id) : onLike(post._id);
                                }}
                                className="flex items-center gap-2 group/action p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            >
                                <motion.div
                                    whileTap={{ scale: 1.4 }}
                                    className={`p-1 rounded-full transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 group-hover/action:text-rose-500'
                                        }`}
                                >
                                    {isLiked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                                </motion.div>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={post.likes.length}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        className={`text-sm ${isLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 group-hover/action:text-rose-500'
                                            }`}
                                    >
                                        {post.likes.length || 0}
                                    </motion.span>
                                </AnimatePresence>
                            </button>

                            <button className="flex items-center gap-2 group/action p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors" onClick={(e) => e.stopPropagation()}>
                                <div className="p-1 rounded-full text-slate-500 dark:text-slate-400 group-hover/action:text-emerald-500 transition-colors">
                                    <HiOutlineShare className="w-5 h-5" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Lightbox Modal */}
            <Lightbox 
                isOpen={isLightboxOpen} 
                onClose={() => setIsLightboxOpen(false)} 
                src={post.image || ''} 
                alt={`${username}'s post`}
            />
        </>
    );
};
