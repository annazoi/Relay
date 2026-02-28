import { useRef, useState, useEffect } from 'react';

const ImagePicker = ({ name = 'image', onChange, children, value }) => {
	const imageRef = useRef(null);
	const [image, setImage] = useState(null);

	useEffect(() => {
		setImage(value);
	}, [value]);

	const handleImageClick = () => {
		imageRef.current.click();
	};

	const handleImage = (event) => {
		const file = event.target.files[0];
		if (file) {
			makeBase64(file).then((base64) => {
				setImage(base64);
				onChange(base64);
			});
		}
	};

	const makeBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				resolve(fileReader.result);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	return (
		<div className="flex flex-col items-center justify-center">
			{children}
			<input
				type="file"
				className="hidden"
				name={name}
				onChange={handleImage}
				accept="image/x-png,image/gif,image/jpeg, image/jpg, image/png"
				ref={imageRef}
			/>

			<div onClick={handleImageClick} className="relative cursor-pointer group">
				{image ? (
					<div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-indigo-100 shadow-xl group-hover:scale-105 transition-transform duration-500">
						<img className="w-full h-full object-cover" src={image} alt={name} />
						<div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
						</div>
					</div>
				) : (
					<div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border-2 border-dashed border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							height="2em"
							strokeLinejoin="round"
							strokeLinecap="round"
							viewBox="0 0 24 24"
							strokeWidth="2"
							fill="none"
							stroke="currentColor"
							className="icon"
						>
							<polyline points="16 16 12 12 8 16"></polyline>
							<line y2="21" x2="12" y1="12" x1="12"></line>
							<path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
							<polyline points="16 16 12 12 8 16"></polyline>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImagePicker;
