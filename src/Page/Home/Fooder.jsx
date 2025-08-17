import React, { useContext } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { HiArrowLongRight, HiDocumentText, HiOutlineHome, HiOutlineTag } from 'react-icons/hi2';
import { FiArrowUp } from 'react-icons/fi';
import { Link } from 'react-router'; // <-- correct import
import Logo from '../Shared/Logo';
import { ThemeContext } from '../../Theme/ThemeProvider';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  // Theme-based classes
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-black text-gray-200';
  const textGray = theme === 'dark' ? 'text-gray-400' : 'text-gray-400';
  const accentColor = theme === 'dark' ? 'text-red-400' : 'text-red-400';
  const accentHover = 'hover:text-red-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-700';

  return (
    <footer className={`${bgClass} py-12 border-t ${borderColor} relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Website Name Centered */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold flex justify-center items-center space-x-3">
            <Logo />
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Empowering Teams. Elevating Productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Terms & About Section */}
          <div className="flex flex-col gap-6">
            <Link
              to="/trams"
              className="flex items-center gap-3 text-lg font-medium hover:text-red-600 transition"
            >
              <HiDocumentText className="w-6 h-6 text-red-500" />
              Terms & Conditions
            </Link>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                About Us <HiArrowLongRight className="w-5 h-5 text-red-500" />
              </h3>
              <p className={textGray}>
                We provide smart HR and employee management software designed to boost productivity and streamline your business operations.
              </p>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 font-medium transition hover:underline"
              >
                View more
                <HiArrowLongRight className="w-5 h-5 text-red-600" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className={`flex items-center gap-2 transition ${accentHover}`}>
                  <HiOutlineTag className={accentColor} /> Features
                </a>
              </li>
              <li>
                <Link to="/about" className={`flex items-center gap-2 transition ${accentHover}`}>
                  <HiOutlineHome className={accentColor} /> About
                </Link>
              </li>
              <li>
                <Link to="/dashboard/contact-us" className={`flex items-center gap-2 transition ${accentHover}`}>
                  <HiOutlineHome className={accentColor} /> Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`flex items-center gap-2 transition ${accentHover}`}>
                  <HiDocumentText className={accentColor} /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className={`${textGray} mb-4`}>web.asif@gmail.com</p>
            <div className={`flex space-x-4 mb-6 ${accentColor}`}>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className={`${accentHover} transition`}>
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className={`${accentHover} transition`}>
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className={`${accentHover} transition`}>
                <FaLinkedinIn size={20} />
              </a>
              <a href="mailto:asif81534@gmail.com" aria-label="Email" className={`${accentHover} transition`}>
                <FaEnvelope size={20} />
              </a>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xs">
              <input
                type="email"
                placeholder="Your email address"
                required
                className={`flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
              >
                Submit
              </button>
            </form>

            <p className={`${textGray} text-sm italic mt-4`}>
              Have questions or need support? Our team is here to help you succeed. Reach out anytime!
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} WorkFleet. All rights reserved.
        </div>

        {/* Scroll to Top / Home Button */}
        <a
          href="#home"
          className="absolute top-6 right-6 animate-bounce text-red-500 text-3xl cursor-pointer"
          title="Scroll to Home"
        >
          <FiArrowUp />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
