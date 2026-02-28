const Spinner = ({ loading }) => {
	if (!loading) return null;

	return (
		<div className="flex justify-center items-center py-12">
			<div className="relative w-12 h-12">
				<div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
				<div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
			</div>
		</div>
	);
};

export default Spinner;
