import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router';
import Lottie from 'react-lottie';
import animationData from '../../assets/Lottii/Animation - 1751962128393.json';
import Logo from '../Shared/Logo';
import UseAuth from '../../Hooks/UseAuth';
import Swal from 'sweetalert2';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const { loginUser, googleSignIn } = UseAuth();
  const navigate = useNavigate();

  // Password show/hide state
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    loginUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        Swal.fire('Success!', 'Logged in successfully', 'success');
        navigate('/');
      })
      .catch(err => {
        console.error(err);
        Swal.fire('Error', err.message || 'Login failed', 'error');
      });
  };

  const onGoogleLogin = () => {
    googleSignIn()
      .then(result => {
        console.log(result.user);
        Swal.fire('Success!', 'Logged in with Google', 'success');
        navigate('/dashboard');
      })
      .catch(err => {
        console.error(err);
        Swal.fire('Error', err.message || 'Google login failed', 'error');
      });
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 px-4 py-8 gap-x-4">
      {/* Lottie Animation */}
      <div className="w-full lg:w-[45%] flex items-center justify-center">
        <Lottie options={defaultOptions} height={350} width={350} />
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-[40%] max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          <Logo />
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/,
                message: 'Invalid email address',
              }
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
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
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">Or login with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full border border-gray-300 rounded-md py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-red-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
