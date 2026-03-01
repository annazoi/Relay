import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
    HiOutlineHeart, HiHeart, HiOutlineChatAlt,
    HiOutlineShare, HiOutlineDotsHorizontal
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

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

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onUnlike }) => {
    const isLiked = post.likes.includes(localStorage.getItem('userId') || '');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
            className="p-4 border-b border-slate-100 transition-colors group cursor-pointer relative"
        >
            <div className="flex gap-3">
                {/* Avatar */}
                <Link to={`/profile/${post.creatorId._id}`} className="shrink-0 pt-1">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200"
                    >
                        {post.creatorId.image ? (
                            <img src={post.creatorId.image} alt={post.creatorId.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                {post.creatorId.username[0].toUpperCase()}
                            </div>
                        )}
                    </motion.div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 group/author min-w-0">
                            <Link to={`/profile/${post.creatorId._id}`} className="font-bold text-slate-900 hover:underline truncate">
                                {post.creatorId.name} {post.creatorId.surname}
                            </Link>
                            <span className="text-slate-500 truncate text-sm">@{post.creatorId.username}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-400 text-sm whitespace-nowrap">
                                {formatDistanceToNow(new Date(post.date))}
                            </span>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                            <HiOutlineDotsHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <Link to={`/post/${post._id}`} className="block mt-1">
                        <p className="text-slate-800 text-[15px] leading-normal whitespace-pre-wrap break-words">
                            {post.description}
                        </p>

                        {post.image && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-3 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50"
                            >
                                <img src={post.image} alt="Post" className="w-full h-auto max-h-[512px] object-cover" />
                            </motion.div>
                        )}
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
                        <Link to={`/post/${post._id}`} className="flex items-center gap-2 group/action p-2 rounded-full hover:bg-sky-50 transition-colors">
                            <div className="p-1 rounded-full text-slate-500 group-hover/action:text-sky-500 transition-colors">
                                <HiOutlineChatAlt className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-slate-500 group-hover/action:text-sky-500">
                                {post.comments?.length || 0}
                            </span>
                        </Link>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                isLiked ? onUnlike(post._id) : onLike(post._id);
                            }}
                            className="flex items-center gap-2 group/action p-2 rounded-full hover:bg-rose-50 transition-colors"
                        >
                            <motion.div
                                whileTap={{ scale: 1.4 }}
                                className={`p-1 rounded-full transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-500 group-hover/action:text-rose-500'
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
                                    className={`text-sm ${isLiked ? 'text-rose-500' : 'text-slate-500 group-hover/action:text-rose-500'
                                        }`}
                                >
                                    {post.likes.length || 0}
                                </motion.span>
                            </AnimatePresence>
                        </button>

                        <button className="flex items-center gap-2 group/action p-2 rounded-full hover:bg-emerald-50 transition-colors">
                            <div className="p-1 rounded-full text-slate-500 group-hover/action:text-emerald-500 transition-colors">
                                <HiOutlineShare className="w-5 h-5" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
