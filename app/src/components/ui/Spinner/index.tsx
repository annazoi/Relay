import React from 'react';
import './style.css';

interface SpinnerProps {
	loading: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ loading }) => {
	if (!loading) return null;
	return (
		<div className="flex justify-center items-center py-4">
			<div className="spinner"></div>
		</div>
	);
};
