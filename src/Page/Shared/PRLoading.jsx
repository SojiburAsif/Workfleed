import React from 'react';

const PRLoading = () => {
  return (
    <div className="card w-full max-w-md mx-auto mt-10 bg-white border border-red-200 rounded-2xl shadow-lg animate-pulse">
      <div className="card-body space-y-4 p-6">
        {/* Заголовок-контур */}
        <div className="h-6 w-3/4 bg-red-100 rounded-md"></div>
        {/* Основной текст-контур */}
        <div className="h-4 w-full bg-red-100 rounded-md"></div>
        <div className="h-4 w-2/3 bg-red-100 rounded-md"></div>
        <div className="h-4 w-1/2 bg-red-100 rounded-md"></div>
      </div>
    </div>
  );
};

export default PRLoading;
