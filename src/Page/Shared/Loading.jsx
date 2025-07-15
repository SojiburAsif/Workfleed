import React from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../../assets/Lottii2/Animation - 1750160556213.json'; // ✅ তোমার Lottie JSON ফাইলের পথ অনুযায়ী আপডেট করো

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Lottie options={defaultOptions} height={200} width={200} />
      <p className="text-lg text-gray-600 mt-4 font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loading;
