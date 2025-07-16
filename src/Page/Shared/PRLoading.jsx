import React from 'react';

const PRLoading = () => {
    return (
        <div className="card border rounded-2xl p-5 animate-pulse bg-gray-100">
            <div className="h-5 w-3/4 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        </div>
    );
};

export default PRLoading;