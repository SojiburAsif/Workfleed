import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingCard = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="bg-whitep-10 w-[90%] max-w-xl flex flex-col items-center gap-6">
        <FaSpinner className="text-red-600 text-6xl animate-spin" />
        <div className="w-full space-y-4">
          <div className="h-6 bg-red-100 rounded skeleton w-3/4"></div>
          <div className="h-4 bg-red-100 rounded skeleton w-full"></div>
          <div className="h-4 bg-red-100 rounded skeleton w-5/6"></div>
          <div className="h-4 bg-red-100 rounded skeleton w-4/6"></div>
        </div>
        <p className="text-red-500 font-semibold">Please wait, loading content...</p>
      </div>
    </div>
  );
};

export default LoadingCard;
