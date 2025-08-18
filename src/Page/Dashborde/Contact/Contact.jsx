import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import UseAxios from '../../../Hooks/UseAxios';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const Contact = () => {
  const axiosSecure = UseAxios();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { email, message } = formData;
    if (!email || !message) {
      return Swal.fire('Oops', 'Please fill out both fields', 'warning');
    }
    setSubmitting(true);
    try {
      await axiosSecure.post('/contact-us', { email, message });
      Swal.fire('Sent!', 'Your message has been sent.', 'success');
      setFormData({ email: '', message: '' });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to send message.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Theme-aware classes
  const pageBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  const btnBg = theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600';
  const iconColor = theme === 'dark' ? 'text-red-400' : 'text-red-500';

  return (
    <div className={`max-w-3xl mx-auto p-6 mt-10 ${pageBg} rounded-lg shadow-lg transition-colors duration-300`}>
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-red-500 text-black hover:bg-red-400 hover:text-white'
            : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900'
        }`}
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-4xl font-bold text-center mb-8 text-red-600">✉ Contact Us</h1>

      {/* Contact Info */}
      <div className="mb-8 space-y-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className={`${iconColor} mt-1`} />
          <div>
            <p className="font-semibold">Bangladesh</p>
            <p>Dinajpur City, PS 5200</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaPhoneAlt className={iconColor} />
          <p>+88017989849494</p>
        </div>
        <div className="flex items-center gap-3">
          <FaEnvelope className={iconColor} />
          <p>web.asif@gamil.com</p>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Your Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`input w-full ${inputBg} rounded-lg`}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Message</span>
          </label>
          <textarea
            name="message"
            placeholder="Your message..."
            value={formData.message}
            onChange={handleChange}
            className={`textarea w-full h-32 ${inputBg} rounded-lg`}
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className={`px-8 py-2 text-white rounded-lg font-semibold ${btnBg} ${submitting ? 'loading' : ''}`}
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
