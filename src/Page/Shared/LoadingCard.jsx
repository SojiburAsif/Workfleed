import React, { useContext } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { ThemeContext } from '../../Theme/ThemeProvider';

const LoadingCard = () => {
  const { theme } = useContext(ThemeContext); 

  const pageBg = theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const skeletonBg = theme === 'dark' ? 'bg-gray-90' : 'bg-red-100';
  const spinnerColor = theme === 'dark' ? 'text-red-400' : 'text-red-600';
  const textColor = theme === 'dark' ? 'text-red-300' : 'text-red-500';

  return (
    <div className={`flex items-center justify-center h-screen ${pageBg}`}>
      <div className={`p-10 w-[90%] max-w-xl flex flex-col items-center gap-6 rounded-lg shadow-md ${cardBg}`}>
        <FaSpinner className={`text-6xl animate-spin ${spinnerColor}`} />
        <div className="w-full space-y-4">
          <div className={`h-6 rounded skeleton w-3/4 ${skeletonBg}`}></div>
          <div className={`h-4 rounded skeleton w-full ${skeletonBg}`}></div>
          <div className={`h-4 rounded skeleton w-5/6 ${skeletonBg}`}></div>
          <div className={`h-4 rounded skeleton w-4/6 ${skeletonBg}`}></div>
        </div>
        <p className={`font-semibold ${textColor}`}>Please wait, loading content...</p>
      </div>
    </div>
  );
};

export default LoadingCard;
