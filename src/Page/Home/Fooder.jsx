import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import Logo from '../Shared/Logo';
import { HiArrowLongRight } from 'react-icons/hi2';

const Footer = () => {
  return (
    <footer className="bg-white mt-9  bg-gradient-to-b from-white via-red-50 to-white text-gray-900 py-12 px-6 lg:px-20 border-t border-gray-200">
      {/* Website Name Centered */}
      <div className="max-w-7xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-bold flex justify-center items-center space-x-3">
          <Logo />
        </h1>
        <p className="text-gray-600 mt-2 text-sm ">
          Empowering Teams. Elevating Productivity.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* About Section */}
           <div className="flex items-start gap-3">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          About Us <HiArrowLongRight className="" />
        </h3>
        <p className="text-gray-700 leading-relaxed">
          We provide smart HR and employee management software designed to boost productivity and streamline your business operations.
        </p>
      </div>
    </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#features" className="hover:text-red-600 transition">Features</a></li>
            <li><a href="#pricing" className="hover:text-red-600 transition">Pricing</a></li>
            <li><a href="#about" className="hover:text-red-600 transition">About</a></li>
            <li><a href="#contact" className="hover:text-red-600 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-700 mb-4">web.asif@gmail.com</p>
          <div className="flex space-x-4 text-red-600 mb-6">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition">
              <FaTwitter size={20} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition">
              <FaLinkedinIn size={20} />
            </a>
            <a href="mailto:support@workfleet.com" aria-label="Email" className="hover:text-red-400 transition">
              <FaEnvelope size={20} />
            </a>
          </div>

          {/* New: Email Input & Submit Button */}
          <form className="flex flex-col sm:flex-row gap-4 max-w-xs">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
            >
              Submit
            </button>
          </form>

          <p className="text-gray-500 text-sm italic mt-4">
            Have questions or need support? Our team is here to help you succeed. Reach out anytime!
          </p>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} WorkFleet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
