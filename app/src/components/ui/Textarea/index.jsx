const Textarea = ({ name, type = '', placeholder, value, props, register, error, className = '', label }) => {
	return (
		<div className={`flex flex-col gap-1.5 w-full ${className}`}>
			{label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
			<textarea
				className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 min-h-[120px] ${
					error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
				}`}
				type={type || 'text'}
				placeholder={placeholder}
				value={value}
				{...props}
				{...(register ? register(name) : {})}
			/>
			{error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
		</div>
	);
};

export default Textarea;
