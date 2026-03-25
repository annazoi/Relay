import { Link } from 'react-router-dom';

const Posts = ({ posts }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{posts.map((post, index) => {
				return (
					<Link
						key={index}
						to={`/post/${post._id}`}
						className="group block p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-300 transition-all duration-500 relative overflow-hidden"
					>
						<div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

						<div className="relative">
							<span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
								Story
							</span>
							<h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
								{post.title}
							</h2>
							<p className="text-slate-500 text-sm line-clamp-3 mb-6">{post.description}</p>

							<div className="flex items-center justify-between text-xs font-medium text-slate-400">
								<span className="flex items-center gap-1">
									<span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
									Read More
								</span>
								<span className="group-hover:translate-x-1 transition-transform duration-300">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</span>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
};

export default Posts;
