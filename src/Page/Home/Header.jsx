import React, {  useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';
import { FiChevronDown } from 'react-icons/fi';
import Logo from '../Shared/Logo';
import UseAuth from '../../Hooks/UseAuth';

const Header = () => {
  const { user,logout  } = UseAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  const navLinkClass = ({ isActive }) =>
    ` font-semibold px-3 py-1 hover:underline hover:text-red-500 ${
      isActive ? 'text-red-500 underline' : ''
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white  ">
      <div className="flex justify-between items-center top-0 left-0 right-0 z-50  min-h-[80px] px-10  text-lg bg-white">
        {/* Left: Logo & Mobile Toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-xl"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              )}
            </svg>
          </button>

       <Logo></Logo>
        </div>

        {/* Center: Desktop Menu */}
        <nav className="hidden lg:flex gap-4">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>

          {/* Dropdown Menu */}
          <div className="relative group font-semibold">
            <span className="cursor-pointer flex items-center gap-1 mt-1">
              Services <FiChevronDown className="mt-[2px]" />
            </span>

            <div className="absolute left-0 mt-2 w-40 bg-white shadow-md rounded-md z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition duration-200">
              <NavLink
                to="/services/sales"
                className="block px-4 py-2 hover:bg-gray-100 text-sm sm:text-base font-semibold hover:text-red-500"
              >
                Sales
              </NavLink>
              <NavLink
                to="/services/support"
                className="block px-4 py-2 hover:bg-gray-100 text-sm sm:text-base font-semibold hover:text-red-500"
              >
                Support
              </NavLink>
            </div>
          </div>

          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Right: Auth buttons / Avatar */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm sm:text-base font-semibold hover:underline hover:text-red-500">Login</Link>
              <Link
                to="/register"
                className="text-sm sm:text-base font-medium rounded-full px-5 py-2 border bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative group">
              <div className="cursor-pointer">
                <img
                  src={user.photoURL || 'https://i.ibb.co/S47T06r9/download-3.png'}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-red-500"
                />
              </div>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition duration-200 z-50">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-4 border-t">
          <nav className="flex flex-col gap-2">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <div>
              <span className="cursor-default font-semibold">Services</span>
              <div className="ml-4 flex flex-col gap-1 mt-1">
                <NavLink to="/services/sales" className={navLinkClass}>Sales</NavLink>
                <NavLink to="/services/support" className={navLinkClass}>Support</NavLink>
              </div>
            </div>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            {user && (
              <button onClick={logout} className="rounded-full hover:bg-red-100 px-4 py-2 text-left text-red-500">
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
