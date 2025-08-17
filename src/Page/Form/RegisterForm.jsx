// RegisterForm.js
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import UseAuth from '../../Hooks/UseAuth';
import axios from 'axios';
import useAxiosIns from '../../Hooks/UseAxiosIns';
import Logo from '../Shared/Logo';
import { ThemeContext } from '../../Theme/ThemeProvider';

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

  const { theme } = useContext(ThemeContext);

  // THEME CLASSES
  const pageBg = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'; // হালকা হালকা gray
  const formBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'; // light এ text-gray-900
  const inputBg = theme === 'dark'
    ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400'
    : 'bg-gray-200 text-gray-950 border-gray-300 placeholder-gray-500'; // subtle light bg
  const labelColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-700'; // light label dark থেকে হালকা
  const googleBtnHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'; // হালকা hover
  const fileBtnStyle = theme === 'dark'
    ? 'file:bg-red-700 file:text-white file:hover:bg-red-600'
    : 'file:bg-red-100 file:text-red-700 file:hover:bg-red-200'; // subtle file btn

  // IMAGE UPLOAD
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
      Swal.fire({ icon: 'error', title: 'Image Upload Failed', text: error.message });
      throw error;
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.replace(/^data:image\/[a-z]+;base64,/, ''));
      reader.onerror = (error) => reject(error);
    });
  };

  // FORM SUBMIT
  const onSubmit = async (data) => {
    if (!data.photo || data.photo.length === 0) {
      Swal.fire({ icon: 'error', title: 'Profile picture is required' });
      return;
    }
    const file = data.photo[0];
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Image size must be less than 2MB' });
      return;
    }

    const uppercaseReg = /[A-Z]/;
    const specialCharReg = /[!@#$%^&*(),.?":{}|<>]/;
    if (!uppercaseReg.test(data.password)) {
      Swal.fire({ icon: 'error', title: 'Password must contain at least one uppercase letter' });
      return;
    }
    if (!specialCharReg.test(data.password)) {
      Swal.fire({ icon: 'error', title: 'Password must contain at least one special character' });
      return;
    }

    try {
      const base64Image = await getBase64(file);
      const imageUrl = await uploadToImgbb(base64Image);
      setUploadedImageUrl(imageUrl);

      await createUser(data.email, data.password);
      await updateUser({ displayName: data.name, photoURL: imageUrl });

      const userInfo = {
        name: data.name,
        email: data.email,
        photo: imageUrl,
        role: data.role,
        bank_account_no: data.bankAccount,
        salary: parseInt(data.salary, 10),
        designation: data.designation,
        registeredAt: new Date().toISOString(),
        isVerified: data.role === 'HR',
      };

      await axiosSecure.post('/users', userInfo);

      navigate('/');
      Swal.fire({ icon: 'success', title: 'Registration Successful!', showConfirmButton: false, timer: 2000 });

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.message });
    }
  };

  // GOOGLE LOGIN
  const onGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;
      navigate('/');
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

      Swal.fire({ icon: 'success', title: 'Google Login Successful!', showConfirmButton: false, timer: 2000 });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Google Sign-In Failed', text: error.message });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row items-center justify-center ${pageBg} px-4 py-8`}>
      <form onSubmit={handleSubmit(onSubmit)}
        className={`w-full lg:w-1/2 max-w-xl sm:max-w-2xl ${formBg} p-4 sm:p-6 md:p-8 rounded-lg  mx-auto`}>

        {/* PROFILE UPLOAD */}
        <div className="mb-6 flex flex-col items-center">
          <label className={`mb-2 font-semibold text-lg ${labelColor}`}>
            <Logo /> Upload Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('photo', { required: true })}
            className={`block w-full text-sm ${fileBtnStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold`}
          />
          {errors.photo && <p className="text-sm text-red-500 mt-1">Profile picture is required</p>}
          {uploading && <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Uploading image...</p>}
          {uploadedImageUrl && (
            <img src={uploadedImageUrl} alt="Uploaded Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mt-4 object-cover border-4 border-red-500 shadow-md" />
          )}
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

          {/* Name */}
          <div>
            <label className={`block mb-1 font-medium ${labelColor}`}>Name</label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={`block mb-1 font-medium ${labelColor}`}>Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>


          {/* Role */}
          <div>
            <label className={`block mb-1 font-medium ${labelColor}`}>Role</label>
            <select {...register('role', { required: 'Please select a role' })}
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`}>
              <option value="">Select Role</option>
              <option value="employee">employee</option>
              <option value="HR">HR</option>
            </select>
            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
          </div>

          {/* Bank Account */}
          <div>
            <label className={`block mb-1 font-medium ${labelColor}`}>Bank Account Number</label>
            <input
              type="text"
              {...register('bankAccount', {
                required: 'Bank account number is required',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Bank account number must contain only numbers'
                },
                minLength: { value: 6, message: 'Bank account number is too short' }
              })}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // শুধু সংখ্যা রাখবে
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`}
              placeholder="Enter your bank account number"
            />
            {errors.bankAccount && <p className="text-sm text-red-500 mt-1">{errors.bankAccount.message}</p>}
          </div>

          {/* Salary */}
          <div>
            <label className={`block mb-1 font-medium ${labelColor}`}>Salary</label>
            <input
              type="number"
              {...register('salary', {
                required: 'Salary is required',
                min: { value: 0, message: 'Salary must be positive' },
                max: { value: 100000, message: 'Salary cannot exceed 100,000' },
                pattern: { value: /^[0-9]+$/, message: 'Salary must be a number' }
              })}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // শুধু সংখ্যা রাখবে
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`}
              placeholder="Enter your salary"
            />
            {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary.message}</p>}
          </div>

          {/* Designation */}
          <div>
            <label className={`block mb-1 font-medium ${labelColor}`}>Designation</label>
            <input
              type="text"
              {...register('designation', {
                required: 'Designation is required',
                minLength: { value: 2, message: 'Designation must be at least 2 characters' }
              })}
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`}
              placeholder="Enter your designation"
            />
            {errors.designation && <p className="text-sm text-red-500 mt-1">{errors.designation.message}</p>}
          </div>


          {/* Password */}
          <div className="sm:col-span-2 relative">
            <label className={`block mb-1 font-medium ${labelColor}`}>Password</label>
            <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              className={`w-full px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-[38px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="sm:col-span-2 relative">
            <label className={`block mb-1 font-medium ${labelColor}`}>Confirm Password</label>
            <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword', { required: 'Please confirm password', validate: (v) => v === password || 'Passwords do not match' })}
              className={`w-full px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${inputBg}`} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-[38px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <div className="sm:col-span-2 flex items-center">
            <input type="checkbox" {...register('terms', { required: 'You must accept the terms and conditions' })} className="mr-2" />
            <label className={`text-sm select-none ${labelColor}`}>
              I accept the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">Terms and Conditions</a>
            </label>
          </div>
          {errors.terms && <p className="sm:col-span-2 text-sm text-red-500 mt-1">{errors.terms.message}</p>}

          {/* Submit */}
          <div className="sm:col-span-2">
            <button type="submit" disabled={isSubmitting || uploading}
              className={`w-full py-2 sm:py-3 rounded-md text-white transition ${isSubmitting || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}>
              {(isSubmitting || uploading) ? 'Processing…' : 'Register'}
            </button>
          </div>

          {/* Divider + Google */}
          <div className="sm:col-span-2">
            <div className="flex items-center my-4 sm:my-6">
              <hr className="flex-grow border-gray-300" />
              <span className={`mx-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Or register with</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <button type="button" onClick={onGoogleLogin}
              className={`w-full border border-gray-300 rounded-md py-2 sm:py-3 flex items-center justify-center gap-2 ${googleBtnHover} transition`}>
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>
          </div>

          {/* Login Link */}
          <p className={`sm:col-span-2 text-center text-sm mt-4 sm:mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account? <Link to="/login" className="text-red-600 hover:underline">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
