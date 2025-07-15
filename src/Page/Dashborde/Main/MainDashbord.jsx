import React from 'react';
import { FaUsers, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const MainDashboard = () => {
  // Dummy data, later you can fetch real-time data
  const totalEmployees = 120;
  const paymentsThisMonth = 90;
  const pendingApprovals = 15;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Employees */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition duration-300">
          <FaUsers className="text-blue-500 text-4xl" />
          <div>
            <h2 className="text-xl font-semibold">Total Employees</h2>
            <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
          </div>
        </div>

        {/* Payments This Month */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition duration-300">
          <FaMoneyBillWave className="text-green-500 text-4xl" />
          <div>
            <h2 className="text-xl font-semibold">Payments This Month</h2>
            <p className="text-2xl font-bold text-gray-800">{paymentsThisMonth}</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition duration-300">
          <FaClock className="text-yellow-500 text-4xl" />
          <div>
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <p className="text-2xl font-bold text-gray-800">{pendingApprovals}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Monitor and manage employee activities, salaries, and approvals—all from one place.
        </p>
      </div>
    </div>
  );
};

export default MainDashboard;
