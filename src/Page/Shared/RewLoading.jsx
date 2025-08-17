import React, { useContext } from 'react';
import { ThemeContext } from '../../Theme/ThemeProvider';


const RewLoading = () => {
  const { theme } = useContext(ThemeContext);

  const wrapperBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const shimmerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const shimmerAnimation = "animate-pulse";

  // create 4 loading cards like dashboard stats
  const cards = Array.from({ length: 4 });

  return (
    <div className={`${wrapperBg} min-h-screen p-6 flex flex-col gap-6`}>
      <h1 className="text-3xl font-bold mb-4">Loading Dashboard...</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((_, idx) => (
          <div key={idx} className={`${cardBg} rounded-2xl p-4 flex flex-col gap-4 shadow`}>
            <div className={`${shimmerBg} ${shimmerAnimation} w-12 h-12 rounded-full`}></div>
            <div className="flex-1 flex flex-col gap-2">
              <div className={`${shimmerBg} ${shimmerAnimation} h-6 rounded w-3/4`}></div>
              <div className={`${shimmerBg} ${shimmerAnimation} h-4 rounded w-1/2`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart-like loading bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className={`${cardBg} rounded-2xl p-5 shadow h-64`}>
            <div className={`${shimmerBg} ${shimmerAnimation} w-full h-6 rounded mb-4`}></div>
            <div className="flex flex-col gap-2 h-full justify-between">
              {Array.from({ length: 5 }).map((__, i) => (
                <div key={i} className={`${shimmerBg} ${shimmerAnimation} h-4 rounded w-full`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewLoading;
