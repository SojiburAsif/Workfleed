import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import {
  ResponsiveContainer,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  Legend
} from 'recharts';
import {
  MdVerified, MdCancel,
  MdEmail, MdPhone
} from 'react-icons/md';
import {
  FaCalendarAlt, FaCheckCircle, FaClock,
  FaMoneyCheckAlt, FaArrowLeft, FaUserCircle
} from 'react-icons/fa';
import UseAxios from '../../../Hooks/UseAxios';
import LoadingCard from '../../Shared/LoadingCard';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const EmployDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [rawPayments, setRawPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const axiosSecure = UseAxios();

  // Fetch user info
  useEffect(() => {
    axiosSecure
      .get(`/users/${id}`)
      .then(res => setUser(res.data))
      .catch(() => Swal.fire('Error', 'Failed to load employee data', 'error'));
  }, [id, axiosSecure]);

  // Fetch payroll history
  useEffect(() => {
    if (!user?.email) return;
    axiosSecure.get(`/payroll?userId=${user._id}`)
      .then(res => {
        setRawPayments(res.data);
        const data = res.data.map(p => ({
          label: `${p.month.slice(0, 3)} ${p.year}`,
          salary: Number(p.salary),
        }));
        setHistory(data);
      })
      .catch(() => Swal.fire('Error', 'Failed to load payroll history', 'error'));
  }, [user?.email, axiosSecure]);

  if (!user) return <LoadingCard />;

  // Theme-aware classes
  const pageBg = theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-950 border border-gray-800 text-gray-100' : 'bg-white border border-gray-200 text-gray-900';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${pageBg} max-w-7xl mx-auto mt-10 px-4 min-h-screen`}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-red-600 font-semibold mb-6 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Profile Card */}
      <div className={`${cardBg} p-6 rounded-lg  flex flex-col md:flex-row items-center md:items-start gap-6 mb-12`}>
        <div className="relative">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-28 h-28 rounded-full border-2 border-red-600 object-cover shadow-md"
            />
          ) : (
            <FaUserCircle className="w-28 h-28 text-gray-400" />
          )}
          {user.isVerified && (
            <MdVerified
              className="absolute -bottom-1 -right-1 text-green-500  rounded-full "
              size={28}
            />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-bold text-red-700 flex items-center gap-2 justify-center md:justify-start">
            {user.name}
            {!user.isVerified && <MdCancel className="text-red-600" />}
          </h3>
          <p className="text-red-400 uppercase tracking-wide mt-1">{user.designation || 'N/A'}</p>
          <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <MdEmail className="text-gray-500" /> <span className={muted}>{user.email || 'N/A'}</span>
            </div>

          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className={`${cardBg} p-6 mb-8 rounded-lg`}>
        <h4 className="text-2xl font-bold text-red-700 mb-4 text-center">
          Salary Trend (Area Chart)
        </h4>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">No salary data to plot.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#ccc'} />
              <XAxis dataKey="label" stroke={theme === 'dark' ? '#eee' : '#555'} />
              <YAxis stroke={theme === 'dark' ? '#eee' : '#555'} />
              <Tooltip formatter={v => `৳ ${v.toFixed(2)}`} contentStyle={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#eee' : '#000' }} />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="salary"
                stroke="#dc2626"
                fill="url(#salaryGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart */}
      <div className={`${cardBg} p-6 mb-8 rounded-lg`}>
        <h4 className="text-2xl font-bold text-red-700 mb-4 text-center">
          Salary History (Bar Chart)
        </h4>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">No salary data to plot.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={history} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#ccc'} />
              <XAxis dataKey="label" stroke={theme === 'dark' ? '#eee' : '#555'} />
              <YAxis stroke={theme === 'dark' ? '#eee' : '#555'} />
              <Tooltip formatter={v => `৳ ${v.toFixed(2)}`} contentStyle={{ backgroundColor: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#eee' : '#000' }} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="salary" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Payment Records */}
      <div className="mt-12 mb-13">
        <h4 className="text-2xl font-bold text-center text-red-600 mb-6">
          Payment Records
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rawPayments.map((p, i) => (
            <div key={i} className={`${cardBg} shadow-md hover:shadow-lg transition-all duration-300 rounded-lg`}>
              <div className="p-4 space-y-2">
                <h2 className="text-lg text-red-500 flex items-center gap-2">
                  <FaCalendarAlt /> {`${p.month.slice(0, 3)} ${p.year}`}
                </h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <FaMoneyCheckAlt className="text-green-600" />
                  <span className="font-medium">৳ {Number(p.salary).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {p.status === "paid" ? (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-green-700 font-semibold">Paid</span>
                    </>
                  ) : (
                    <>
                      <FaClock className="text-yellow-500" />
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployDetails;
