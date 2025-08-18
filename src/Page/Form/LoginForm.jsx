import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate, useLocation } from 'react-router';
import Lottie from 'react-lottie';
import animationData from '../../assets/Lottii/Animation - 1751962128393.json';
import Logo from '../Shared/Logo';
import UseAuth from '../../Hooks/UseAuth';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../Theme/ThemeProvider';
import LRLoading from '../Shared/LRLoading';


const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { loginUser, googleSignIn } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // navigate path

  const [showPassword, setShowPassword] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const { theme } = useContext(ThemeContext); // dark / light

  const pageBg = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const formBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-800';
  const inputStyle =
    theme === 'dark'
      ? 'bg-gray-800 text-gray-100 border border-gray-600 placeholder-gray-400 focus:ring-red-500'
      : 'bg-white text-gray-800 border border-gray-300 placeholder-gray-400 focus:ring-red-500';
  const linkColor = 'text-red-600 hover:underline';
  const googleBtn =
    theme === 'dark'
      ? 'border-gray-600 hover:bg-gray-800 text-gray-100'
      : 'border-gray-300 hover:bg-gray-100 text-gray-800';

  // Normal Login
  const onSubmit = async (data) => {
    setIsBusy(true);
    try {
      await loginUser(data.email, data.password);
      Swal.fire('Success!', 'Logged in successfully', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire('Error', err.message || 'Login failed', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  // Google Login
  const onGoogleLogin = async () => {
    setIsBusy(true);
    try {
      await googleSignIn();
      Swal.fire('Success!', 'Logged in with Google', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire('Error', err.message || 'Google login failed', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <>
      {/* Loader */}
      {isBusy && <LRLoading/>}

      <div
        className={`min-h-screen flex flex-col lg:flex-row items-center justify-center ${pageBg} px-4 py-8 gap-x-4 transition-colors duration-300`}
      >
        {/* Lottie Animation */}
        <div className="w-full lg:w-[45%] flex items-center justify-center">
          <div className="w-[350px] h-[350px]">
            <Lottie options={defaultOptions} height={350} width={350} />
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-full lg:w-[40%] max-w-md ${formBg} p-6 rounded-lg shadow transition-colors duration-300`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            <Logo />
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className={`block mb-1 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 ${inputStyle}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className={`block mb-1 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 characters'
                }
              })}
              className={`w-full px-4 py-3 rounded-md pr-10 focus:outline-none focus:ring-2 ${inputStyle}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-[38px] text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
            </button>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link to="/forgot-password" className={`${linkColor}`}>
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition disabled:opacity-60"
          >
            {isBusy ? 'Logging in…' : 'Login'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-400" />
            <span className={`mx-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
              Or login with
            </span>
            <hr className="flex-grow border-gray-400" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={isBusy}
            className={`w-full rounded-md py-3 flex items-center justify-center gap-2 border ${googleBtn} transition disabled:opacity-60`}
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Register Link */}
          <p className={`text-center text-sm mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Don’t have an account?{' '}
            <Link to="/register" className="text-red-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
