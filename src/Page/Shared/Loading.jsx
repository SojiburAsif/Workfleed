import React, { useContext } from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../../assets/Lottii2/Animation - 1750160556213.json';
import { ThemeContext } from '../../Theme/ThemeProvider';

const Loading = () => {
  const { theme } = useContext(ThemeContext);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const pageBg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-600';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${pageBg}`}>
      <Lottie options={defaultOptions} height={200} width={200} />
      <p className={`text-lg mt-4 font-semibold animate-pulse ${textColor}`}>
        Loading...
      </p>
    </div>
  );
};

export default Loading;
