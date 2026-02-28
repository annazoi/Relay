import { AiFillCloseCircle } from 'react-icons/ai';
import { useEffect } from 'react';

const Modal = ({ isOpen, handlClose, children }) => {
	// Prevent scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => handlClose(false)}></div>

			{/* Modal Content */}
			<div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl shadow-slate-950/20 overflow-hidden animate-in zoom-in-95 duration-300">
				<div className="absolute top-6 right-8 z-10">
					<button
						onClick={() => handlClose(false)}
						className="text-slate-300 hover:text-indigo-600 transition-colors p-2 rounded-2xl hover:bg-slate-50"
					>
						<AiFillCloseCircle className="w-10 h-10" />
					</button>
				</div>

				<div className="p-10 md:p-14 max-h-[90vh] overflow-y-auto custom-scrollbar">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
