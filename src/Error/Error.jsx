import React from 'react';
import Lottie from 'react-lottie';
import errorAnimation from '../assets/Lottii2/Animation - 1748975144594.json';
import { Link } from 'react-router'; 

const Error = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: errorAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <Lottie options={defaultOptions} height={300} width={300} />

      {/* 🔴 404 Text */}
      <h1 className="text-6xl font-extrabold text-red-600 mt-4">404</h1>

      <h2 className="text-3xl font-bold text-red-600 mt-2">Oops! Page Not Found</h2>
      <p className="text-gray-600 mt-2 text-lg">
        The page you're looking for doesn't exist or something went wrong.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
