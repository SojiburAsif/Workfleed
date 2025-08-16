// Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import { FiChevronDown } from 'react-icons/fi';
import Logo from '../Shared/Logo';
import UseAuth from '../../Hooks/UseAuth';
import { ThemeContext } from '../../Theme/ThemeProvider';

const Header = () => {
  const { user, logout } = UseAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Theme-based classes
  const containerClass = theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black';
  const dropdownBg = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';

  const navLinkClass = ({ isActive }) =>
    `font-semibold px-4 py-2 transition-colors duration-200 ${isActive ? 'text-red-500 underline' : theme === 'light' ? 'text-black' : 'text-white'} hover:text-red-500`;

  return (
    <header className={`fixed top-0 md:rounded-full  md:mt-5 left-0 right-0 z-50 shadow-md transition-colors duration-300 ${containerClass}`}>
      <div className="flex justify-between items-center min-h-[90px] px-4 sm:px-6 lg:px-12 text-lg w-full">

        {/* Left: Logo + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Logo />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 items-center">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>

          <div className="relative group font-semibold">
            <span className="cursor-pointer flex items-center gap-1">Services <FiChevronDown className="mt-[2px]" /></span>
            <div className={`absolute left-0 mt-2 w-44 shadow-md rounded-md z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition duration-200 ${dropdownBg}`}>
              <NavLink to="/services/sales" className={`block px-4 py-2 font-semibold ${hoverBg} hover:text-red-500`}>Sales</NavLink>
              <NavLink to="/services/support" className={`block px-4 py-2 font-semibold ${hoverBg} hover:text-red-500`}>Support</NavLink>
            </div>
          </div>

          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Right: Auth + Theme */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle using swap-rotate */}
          <label className="swap swap-rotate cursor-pointer">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === 'dark'}
            />
            {/* Sun Icon */}
            <svg
              className="swap-on h-8 w-8 sm:h-8 sm:w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* Moon Icon */}
            <svg
              className="swap-off h-8 w-8 sm:h-8 sm:w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          {!user ? (
            <>
              <Link to="/login" className="text-sm font-semibold hover:underline hover:text-red-500">Login</Link>
              <Link to="/register" className="text-sm font-medium rounded-full px-5 py-2 border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">Register</Link>
            </>
          ) : (
            <div className="hidden sm:flex relative group">
              <img
                src={user.photoURL || 'https://i.ibb.co/S47T06r9/download-3.png'}
                alt="User Avatar"
                className="w-16 h-16 md:w-16 md:h-16 rounded-full border-2 border-red-500 cursor-pointer"
              />
              <div className={`absolute right-0 mt-2 w-44 shadow-lg rounded-md transition duration-200 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 ${dropdownBg}`}>
                <button onClick={logout} className={`w-full px-4 py-2 text-left text-red-500 ${hoverBg}`}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed top-[90px] left-0 right-0 z-40 px-0 py-4 border-t transition-all duration-300 ${containerClass} border-gray-300 dark:border-gray-700`}>
          <nav className="flex flex-col gap-2 w-full px-4">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>

            <div>
              <span className="cursor-default font-semibold block mb-1">Services</span>
              <div className="ml-0 flex flex-col gap-1">
                <NavLink to="/services/sales" className={`px-4 py-2 rounded ${hoverBg} font-medium`}>Sales</NavLink>
                <NavLink to="/services/support" className={`px-4 py-2 rounded ${hoverBg} font-medium`}>Support</NavLink>
              </div>
            </div>

            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

            {user && (
              <button
                onClick={logout}
                className={`w-full text-left px-4 py-2 rounded ${hoverBg} text-red-500 font-semibold mt-2`}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}

    </header>
  );
};

export default Header;
