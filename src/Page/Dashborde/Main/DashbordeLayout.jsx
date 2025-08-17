import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  FaBars, FaHome, FaFileInvoiceDollar, FaTasks,
  FaUsersCog, FaUserTie, FaUser, FaUserShield, FaSignOutAlt
} from 'react-icons/fa';
import Logo from '../../Shared/Logo';
import useUserRole from '../../../Hooks/UseUserRole';
import UseAuth from '../../../Hooks/UseAuth';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const DashboardLayout = () => {
  const { role: rawRole } = useUserRole();
  const role = rawRole?.toLowerCase();
  const { logout } = UseAuth();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Theme context

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Active & inactive link styling
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200 ${
      isActive
        ? 'font-bold text-red-600'
        : theme === 'dark'
        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
        : 'text-gray-800 hover:text-red-600 hover:bg-gray-100'
    }`;

  // Sidebar background based on theme
  const sidebarBg =
    theme === 'dark'
      ? 'bg-gray-950 text-gray-300'
      : 'bg-white text-gray-800';

  const drawerOverlayBg = theme === 'dark' ? 'bg-black/70' : 'bg-black/30';

  return (
    <div  className={`drawer  lg:drawer-open ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Content Area */}
      <div className="drawer-content flex flex-col  ">
        <div className="lg:hidden mb-4">
          <label htmlFor="dashboard-drawer" className="btn">
            <FaBars className="mr-2" /> Menu
          </label>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className={`drawer-overlay ${drawerOverlayBg}`}></label>
        <ul className={`menu p-6 w-64 min-h-full ${sidebarBg}   rounded-xl  shadow-lg flex flex-col justify-between`}>
          <div>
            <li className="mb-6"><Logo /></li>

            {/* Shared - All Users */}
            <li>
              <NavLink to="/dashboard" className={linkClass}>
                <FaHome /> Dashboard Home
              </NavLink>
            </li>

            {/* Employee */}
            {role === 'employee' && (
              <>
                <li className="menu-title mt-6 text-red-500">Employee</li>
                <li>
                  <NavLink to="/dashboard/work-sheet" className={linkClass}>
                    <FaTasks /> Work Sheet
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/payment-history" className={linkClass}>
                    <FaFileInvoiceDollar /> Payment History
                  </NavLink>
                </li>
              </>
            )}

            {/* HR */}
            {role === 'hr' && (
              <>
                <li className="menu-title mt-6 text-red-500">HR</li>
                <li>
                  <NavLink to="/dashboard/employList" className={linkClass}>
                    <FaUserTie /> Employee List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/progress" className={linkClass}>
                    <FaUsersCog /> Progress
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin */}
            {role === 'admin' && (
              <>
                <li className="menu-title mt-6 text-red-500">Admin</li>
                <li>
                  <NavLink to="/dashboard/makeAdmin" className={linkClass}>
                    <FaUserShield /> Make Admin
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/allEmployeeList" className={linkClass}>
                    <FaUsersCog /> All Employee List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/payroll" className={linkClass}>
                    <FaFileInvoiceDollar /> Payroll
                  </NavLink>
                </li>
              </>
            )}

            {/* Shared */}
            <li className="mt-6">
              <NavLink to="/dashboard/contact-us" className={linkClass}>
                <FaUser /> Contact Us
              </NavLink>
            </li>
          </div>

          {/* Logout Button */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 w-full py-2 px-4 rounded-md transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;



