// Support.js
import React, { useState, useContext } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCommentDots, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../Theme/ThemeProvider';
import { useNavigate } from 'react-router';

const Support = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(formData);
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'We will contact you soon.',
            confirmButtonColor: '#dc2626', // Tailwind red-600
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div
            className={`min-h-screen  flex items-center justify-center p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-950' : 'bg-red-50'
                }`}
        >
            <div
                className={`shadow-lg rounded-xl max-w-3xl w-full p-6 sm:p-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${theme === 'dark'
                            ? 'bg-red-500 text-black hover:bg-red-400 hover:text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900'
                        }`}
                >
                    <FaArrowLeft /> Back
                </button>

                <h2
                    className={`text-3xl font-bold mb-6 text-center transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}
                >
                    Contact Support
                </h2>
                <p
                    className={`text-center mb-8 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                >
                    Fill out the form below and our team will get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div
                        className={`flex items-center border rounded-lg px-3 py-2 transition-colors duration-300 ${theme === 'dark'
                                ? 'border-gray-600 focus-within:border-red-400'
                                : 'border-red-300 focus-within:border-red-500'
                            }`}
                    >
                        <FaUser
                            className={`mr-3 transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'
                                }`}
                        />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className={`w-full bg-transparent focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}
                        />
                    </div>

                    {/* Email */}
                    <div
                        className={`flex items-center border rounded-lg px-3 py-2 transition-colors duration-300 ${theme === 'dark'
                                ? 'border-gray-600 focus-within:border-red-400'
                                : 'border-red-300 focus-within:border-red-500'
                            }`}
                    >
                        <FaEnvelope
                            className={`mr-3 transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'
                                }`}
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                            className={`w-full bg-transparent focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}
                        />
                    </div>

                    {/* Phone */}
                    <div
                        className={`flex items-center border rounded-lg px-3 py-2 transition-colors duration-300 ${theme === 'dark'
                                ? 'border-gray-600 focus-within:border-red-400'
                                : 'border-red-300 focus-within:border-red-500'
                            }`}
                    >
                        <FaPhone
                            className={`mr-3 transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'
                                }`}
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Your Phone"
                            className={`w-full bg-transparent focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}
                        />
                    </div>

                    {/* Message */}
                    <div
                        className={`flex items-start border rounded-lg px-3 py-2 transition-colors duration-300 ${theme === 'dark'
                                ? 'border-gray-600 focus-within:border-red-400'
                                : 'border-red-300 focus-within:border-red-500'
                            }`}
                    >
                        <FaCommentDots
                            className={`mr-3 mt-2 transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'
                                }`}
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            required
                            rows="4"
                            className={`w-full bg-transparent focus:outline-none resize-none transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 rounded-lg transition duration-300"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Support;
