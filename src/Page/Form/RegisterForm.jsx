import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Lottie from 'react-lottie';
import animationData from '../../assets/Lottii/Animation - 1751962180390.json';
import Swal from 'sweetalert2';
import UseAuth from '../../Hooks/UseAuth';
import axios from 'axios';
import useAxiosIns from '../../Hooks/UseAxiosIns';
import Logo from '../Shared/Logo';

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const { createUser, googleSignIn, updateUser } = UseAuth();
  const navigate = useNavigate();
  const password = watch('password', '');

  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const axiosSecure = useAxiosIns();

  const uploadToImgbb = async (base64Image) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', base64Image);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=0b8044c43759b62ba2819474237a94de`,
        formData
      );
      setUploading(false);
      return response.data.data.url;
    } catch (error) {
      setUploading(false);
      Swal.fire({
        icon: 'error',
        title: 'Image Upload Failed',
        text: error.message
      });
      throw error;
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve(reader.result.replace(/^data:image\/[a-z]+;base64,/, ''));
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    if (!data.photo || data.photo.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Profile picture is required',
      });
      return;
    }

    const file = data.photo[0];
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Image size must be less than 2MB',
      });
      return;
    }

    const uppercaseReg = /[A-Z]/;
    const specialCharReg = /[!@#$%^&*(),.?":{}|<>]/;
    if (!uppercaseReg.test(data.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Password must contain at least one uppercase letter',
      });
      return;
    }
    if (!specialCharReg.test(data.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Password must contain at least one special character',
      });
      return;
    }

    try {
      const base64Image = await getBase64(file);
      const imageUrl = await uploadToImgbb(base64Image);
      setUploadedImageUrl(imageUrl);

      await createUser(data.email, data.password);
      await updateUser({
        displayName: data.name,
        photoURL: imageUrl,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        photo: imageUrl,
        role: data.role,
        bank_account_no: data.bankAccount,
        salary: parseInt(data.salary),
        designation: data.designation,
        registeredAt: new Date().toISOString(),
        isVerified: data.role === 'HR',
      };

      await axiosSecure.post('/users', userInfo);

      navigate('/');
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        showConfirmButton: false,
        timer: 2000,
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
      });
    }
  };

  const onGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      const userInfo = {
        name: user.displayName || 'No Name',
        email: user.email,
        photo: user.photoURL || '',
        role: 'employee',
        bank_account_no: 'N/A',
        salary: 0,
        designation: 'Employee',
        registeredAt: new Date().toISOString(),
        isVerified: false,
      };

      await axiosSecure.post('/users', userInfo);

      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful!',
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/');

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: error.message,
      });
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 px-4 py-8 gap-x-4">
      <div className="w-full lg:w-[45%] flex items-center justify-center">
        <Lottie options={defaultOptions} height={350} width={350} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-[40%] max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex flex-col items-center mb-6">
          <label className="mb-2 font-semibold text-gray-700 text-lg">
            <Logo /> Upload Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('photo', { required: true })}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          {errors.photo && (
            <p className="text-sm text-red-500 mt-1">Profile picture is required</p>
          )}
          {uploading && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
          {uploadedImageUrl && (
            <img
              src={uploadedImageUrl}
              alt="Uploaded Profile"
              className="w-28 h-28 rounded-full mt-4 object-cover border-4 border-red-500 shadow-md"
            />
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Role</label>
          <select
            id="role"
            {...register('role', { required: 'Please select a role' })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select Role</option>
            <option value="employee">employee</option>
            <option value="HR">HR</option>
          </select>
          {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
        </div>

        {/* Bank Account */}
        <div className="mb-4">
          <label htmlFor="bankAccount" className="block mb-1 font-medium text-gray-700">Bank Account Number</label>
          <input
            type="text"
            id="bankAccount"
            {...register('bankAccount', {
              required: 'Bank account number is required',
              minLength: { value: 6, message: 'Bank account number is too short' },
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.bankAccount && (
            <p className="text-sm text-red-500 mt-1">{errors.bankAccount.message}</p>
          )}
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label htmlFor="salary" className="block mb-1 font-medium text-gray-700">Salary</label>
          <input
            type="number"
            id="salary"
            {...register('salary', {
              required: 'Salary is required',
              min: { value: 0, message: 'Salary must be positive' },
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary.message}</p>}
        </div>

        {/* Designation */}
        <div className="mb-4">
          <label htmlFor="designation" className="block mb-1 font-medium text-gray-700">Designation</label>
          <input
            type="text"
            id="designation"
            {...register('designation', {
              required: 'Designation is required',
              minLength: { value: 2, message: 'Designation must be at least 2 characters' },
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.designation && (
            <p className="text-sm text-red-500 mt-1">{errors.designation.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
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

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
          />
          <div
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
            title={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="terms"
            {...register('terms', { required: 'You must accept the terms and conditions' })}
            className="mr-2"
          />
          <label htmlFor="terms" className="text-gray-700 text-sm select-none">
            I accept the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">
              Terms and Conditions
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-500 mt-1">{errors.terms.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className={`w-full py-3 rounded-md text-white transition ${isSubmitting || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {(isSubmitting || uploading) ? 'Processing…' : 'Register'}
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">Or register with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full border border-gray-300 rounded-md py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
