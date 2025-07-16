import React from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaBars, FaHome, FaFileInvoiceDollar, FaTasks,
  FaUsersCog, FaUserTie, FaUser, FaUserShield
} from 'react-icons/fa';
import Logo from '../../Shared/Logo';
import useUserRole from '../../../Hooks/UseUserRole';

const DashboardLayout = () => {
  const { role: rawRole } = useUserRole();
  const role = rawRole?.toLowerCase(); // Normalize: 'admin', 'hr', 'employee'

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 ${isActive ? 'font-bold text-red-700' : 'text-red-500'}`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="p-4 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn">
            <FaBars className="mr-2" /> Menu
          </label>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-4"><Logo /></li>

          {/* Shared - All Users */}
          <li>
            <NavLink to="/dashboard" className={linkClass}>
              <FaHome /> Dashboard Home
            </NavLink>
          </li>

          {/* Employee Only */}
          {role === 'admin' && (
            <>
              <li className="menu-title mt-4 text-red-500">Employee</li>
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

          {/* HR Only */}
          {role === 'admin' && (
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

          {/* Admin Only */}
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

          {/* Shared - All Users */}
          <li className="mt-6">
            <NavLink to="/dashboard/contact-us" className={linkClass}>
              <FaUser /> Contact Us
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
