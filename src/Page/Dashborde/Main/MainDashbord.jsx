import React, { useEffect, useState } from 'react';
import UseAxios from '../../../Hooks/UseAxios';
import {
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaTasks,
} from 'react-icons/fa';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from 'recharts';

const MainDashboard = () => {
  const axiosSecure = UseAxios();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [paymentsThisMonth, setPaymentsThisMonth] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [totalWorks, setTotalWorks] = useState(0);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. All users
        const usersRes = await axiosSecure.get('/users');
        const users = usersRes.data || [];

        const verifiedUsers = users.filter(user => user.isVerified === true);
        const unverifiedUsers = users.filter(user => user.isVerified === false);
        setTotalEmployees(verifiedUsers.length);

        // 2. All payrolls
        const prRes = await axiosSecure.get('/payroll/all');
        const payrolls = prRes.data;

        const now = new Date();
        const monthName = now.toLocaleString('default', { month: 'long' });
        const yearStr = now.getFullYear().toString();

        const thisMonth = payrolls.filter(
          p => p.month === monthName && p.year === yearStr
        );
        setPaymentsThisMonth(thisMonth.length);

        const pendingPayrolls = thisMonth.filter(p => !p.paid).length;
        setPendingApprovals(unverifiedUsers.length + pendingPayrolls); // 🔴 Add unverified users

        // 3. Total works
        const workRes = await axiosSecure.get('/works');
        const works = workRes.data;
        setTotalWorks(works.length);

        // Pie chart data
        setPieData([
          { name: 'Paid', value: thisMonth.length - pendingPayrolls },
          { name: 'Pending Payrolls + Unverified', value: unverifiedUsers.length + pendingPayrolls },
          { name: 'Works', value: works.length },
        ]);
      } catch (err) {
        console.error('Dashboard load error', err);
      }
    };
    fetchData();
  }, [axiosSecure]);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Welcome to the Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Employees */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 hover:shadow-md transition">
          <FaUsers className="text-red-500 text-3xl sm:text-4xl" />
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold">Employees</h2>
            <p className="text-xl font-bold">{totalEmployees}</p>
          </div>
        </div>

        {/* Works */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 hover:shadow-md transition">
          <FaTasks className="text-red-500 text-3xl sm:text-4xl" />
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold">Total Works</h2>
            <p className="text-xl font-bold">{totalWorks}</p>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 hover:shadow-md transition">
          <FaMoneyBillWave className="text-red-500 text-3xl sm:text-4xl" />
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold">Payments This Month</h2>
            <p className="text-xl font-bold">{paymentsThisMonth}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 hover:shadow-md transition">
          <FaClock className="text-red-500 text-3xl sm:text-4xl" />
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold">Pending Approvals</h2>
            <p className="text-xl font-bold">{pendingApprovals}</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
          This Month Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              label
            >
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
