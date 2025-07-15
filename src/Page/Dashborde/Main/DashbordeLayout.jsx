import React from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaBars,
  FaHome,
  FaFileInvoiceDollar,
  FaTasks,
  FaUsersCog,
  FaUserTie,
  FaUser,
  FaUserShield
} from 'react-icons/fa';
import Logo from '../../Shared/Logo';
import useUserRole from '../../../Hooks/UseUserRole';
import UseAuth from '../../../Hooks/UseAuth';

const DashboardLayout = () => {
  const { role } = useUserRole();
  const { user } = UseAuth();

  console.log(role);
  return (
    <div className="drawer lg:drawer-open">
      {/* Toggle checkbox for drawer */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile toggle button */}
        <div className="p-4 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn">
            <FaBars className="mr-2" />
            Menu
          </label>
        </div>

        {/* Main Outlet */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-4">
            <Logo />
          </li>

          {/* Dashboard Home (সবার জন্য) */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? 'font-bold text-black' : 'text-black'}`
              }
            >
              <FaHome className="text-lg" /> Dashboard Home
            </NavLink>
          </li>

          {/* Employee Section (Employee, HR, Admin) */}
          {(role === 'employee' || role === 'HR' || role === 'admin') && (
            <>
              <li className="menu-title mt-4 text-black">Employee</li>
              <li>
                <NavLink
                  to="/dashboard/work-sheet"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-black' : 'text-black'}`
                  }
                >
                  <FaTasks className="text-lg" /> Work Sheet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/payment-history"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-black' : 'text-black'}`
                  }
                >
                  <FaFileInvoiceDollar className="text-lg" /> Payment History
                </NavLink>
              </li>
            </>
          )}

          {/* HR Section (HR এবং Admin এর জন্য) */}
          {(role === 'HR' || role === 'admin') && (
            <>
              <li className="menu-title mt-6 text-green-600">HR</li>
              <li>
                <NavLink
                  to="/dashboard/employList"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-green-600' : 'text-green-600'}`
                  }
                >
                  <FaUserTie className="text-lg" /> Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/progress"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-green-600' : 'text-green-600'}`
                  }
                >
                  <FaUsersCog className="text-lg" /> Progress
                </NavLink>
              </li>
            </>
          )}

          {/* Admin Section (শুধু Admin এর জন্য) */}
          {role === 'admin' && (
            <>
              <li className="menu-title mt-6 text-red-600">Admin</li>
              <li>
                <NavLink
                  to="/dashboard/makeAdmin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-red-600' : 'text-red-600'}`
                  }
                >
                  <FaUserShield className="text-lg" /> Make Admin
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/allEmployeeList"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-red-600' : 'text-red-600'}`
                  }
                >
                  <FaUsersCog className="text-lg" /> All Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/payroll"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'font-bold text-red-600' : 'text-red-600'}`
                  }
                >
                  <FaFileInvoiceDollar className="text-lg" /> Payroll
                </NavLink>
              </li>
            </>
          )}

          {/* Contact Us (সবার জন্য) */}
          <li className="mt-6">
            <NavLink
              to="/dashboard/contact-us"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? 'font-bold text-gray-700' : 'text-gray-700'}`
              }
            >
              <FaUser className="text-lg" /> Contact Us
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
