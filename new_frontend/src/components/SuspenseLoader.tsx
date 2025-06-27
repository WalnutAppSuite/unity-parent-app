import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const SuspenseLoader: React.FC = () => {
    return (
        <div className="tw-min-h-screen tw-w-full tw-flex tw-items-center tw-justify-center tw-bg-gray-50">
            <div className="text-center tw-w-1/2">
                <LoadingSpinner size="lg" />
            </div>
        </div>
    );
};

export default SuspenseLoader; 