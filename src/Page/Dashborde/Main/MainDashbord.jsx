import React, { useEffect, useState, useContext } from 'react';
import UseAxios from '../../../Hooks/UseAxios';
import UseAuth from '../../../Hooks/UseAuth';
import {
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaTasks,
} from 'react-icons/fa';
import { MdVerified, MdClose } from 'react-icons/md';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import LoadingCard from '../../Shared/LoadingCard';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const MainDashboard = () => {
  const axiosSecure = UseAxios();
  const { user } = UseAuth();
  const { theme } = useContext(ThemeContext); // Theme context

  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [paymentsThisMonth, setPaymentsThisMonth] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [totalWorks, setTotalWorks] = useState(0);
  const [barChartData, setBarChartData] = useState([]);
  const [latestUser, setLatestUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosSecure.get(`/user/${user.email}`);
        setLatestUser(userRes.data);

        const usersRes = await axiosSecure.get('/users');
        const users = usersRes.data || [];
        const verifiedUsers = users.filter(u => u.isVerified);
        const unverifiedUsers = users.filter(u => !u.isVerified);
        setTotalEmployees(verifiedUsers.length);

        const prRes = await axiosSecure.get('/payroll/all');
        const payrolls = prRes.data || [];
        const now = new Date();
        const monthName = now.toLocaleString('default', { month: 'long' });
        const yearStr = now.getFullYear().toString();
        const thisMonth = payrolls.filter(p => p.month === monthName && p.year === yearStr);
        setPaymentsThisMonth(thisMonth.length);

        const pendingPayrolls = thisMonth.filter(p => !p.paid).length;
        setPendingApprovals(unverifiedUsers.length + pendingPayrolls);

        const workRes = await axiosSecure.get('/works');
        const works = workRes.data || [];
        setTotalWorks(works.length);

        setBarChartData([
          { name: 'Paid', value: thisMonth.length - pendingPayrolls },
          { name: 'Pending + Unverified', value: unverifiedUsers.length + pendingPayrolls },
          { name: 'Total Works', value: works.length },
        ]);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchData();
  }, [axiosSecure, user?.email]);

  if (loading) return <LoadingCard />;

  // Theme-aware classes
  const wrapperBg = theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-100 text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const chartStroke = theme === 'dark' ? '#374151' : '#E5E7EB'; // grid lines color

  return (
    <div className={`${wrapperBg} p-4 bg-black sm:p-6 max-w-7xl mx-auto space-y-8 relative min-h-screen`}>
      {latestUser && (
        <div className={`${cardBg} absolute top-4 left-4 shadow-sm rounded-2xl p-4 flex items-center gap-4 z-10`}>
          <img
            src={latestUser.photo}
            alt={latestUser.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-300"
          />
          <div>
            <p className="text-lg font-semibold">{latestUser.name}</p>
            <p className="text-sm text-gray-500 capitalize">{latestUser.role}</p>
            <div className="flex items-center gap-2 text-sm">
              {latestUser.isVerified ? (
                <>
                  <MdVerified className="text-green-500 text-xl" />
                  <span className={subText}>Verified</span>
                </>
              ) : (
                <>
                  <MdClose className="text-red-500 text-xl" />
                  <span className={subText}>Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-20">
        Welcome to the Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[{
          icon: <FaUsers className="text-red-500 text-3xl sm:text-4xl" />,
          label: 'Employees',
          value: totalEmployees
        }, {
          icon: <FaTasks className="text-red-500 text-3xl sm:text-4xl" />,
          label: 'Total Works',
          value: totalWorks
        }, {
          icon: <FaMoneyBillWave className="text-red-500 text-3xl sm:text-4xl" />,
          label: 'Payments This Month',
          value: paymentsThisMonth
        }, {
          icon: <FaClock className="text-red-500 text-3xl sm:text-4xl" />,
          label: 'Pending Approvals',
          value: pendingApprovals
        }].map(({ icon, label, value }) => (
          <div key={label} className={`${cardBg} rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 hover:shadow-md transition`}>
            {icon}
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold">{label}</h2>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${cardBg} p-6 sm:p-8 rounded-2xl w-full`}>
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Monthly Summary Overview
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid stroke={chartStroke} strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={theme === 'dark' ? '#D1D5DB' : '#374151'} />
            <YAxis stroke={theme === 'dark' ? '#D1D5DB' : '#374151'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                color: theme === 'dark' ? '#F9FAFB' : '#111827',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#EF4444" barSize={40} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
