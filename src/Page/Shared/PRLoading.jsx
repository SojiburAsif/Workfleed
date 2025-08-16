import React, { useContext } from 'react';
import { ThemeContext } from '../../Theme/ThemeProvider';

const PRLoading = () => {
  const { theme } = useContext(ThemeContext);

  const cardBg = theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-red-200';
  const skeletonBg = theme === 'dark' ? 'bg-gray-950' : 'bg-red-100';

  return (
    <div className={`card w-full max-w-md mx-auto mt-10 ${cardBg} rounded-2xl shadow-lg animate-pulse`}>
      <div className="card-body space-y-4 p-6">
        {/* Заголовок-контур */}
        <div className={`h-6 w-3/4 ${skeletonBg} rounded-md`}></div>
        {/* Основной текст-контур */}
        <div className={`h-4 w-full ${skeletonBg} rounded-md`}></div>
        <div className={`h-4 w-2/3 ${skeletonBg} rounded-md`}></div>
        <div className={`h-4 w-1/2 ${skeletonBg} rounded-md`}></div>
      </div>
    </div>
  );
};

export default PRLoading;
