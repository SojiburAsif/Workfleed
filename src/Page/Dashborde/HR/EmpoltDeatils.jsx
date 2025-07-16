import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import {
  ResponsiveContainer,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  Legend
} from 'recharts';
import { MdVerified, MdCancel } from 'react-icons/md';
import UseAxios from '../../../Hooks/UseAxios';
import LoadingCard from '../../Shared/LoadingCard';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaMoneyCheckAlt } from 'react-icons/fa';

const EmployDetails = () => {
  const { id } = useParams();
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

  // Determine most recent status



  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 bg-gradient-to-b from-white via-red-50 to-white min-h-screen">
      {/* ====== Profile + Status ====== */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <img
          src={user.photo || '/placeholder.png'}
          alt={user.name}
          className="w-24 h-24 rounded-full border-2 border-red-600 shadow-md object-cover"
        />
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-red-700">{user.name}</h3>
          <p className="text-red-400 uppercase tracking-wide">{user.designation || 'N/A'}</p>
          <p className="mt-2 flex items-center gap-2 justify-center md:justify-start text-lg">
            {user.isVerified ? (
              <><MdVerified className="text-green-600" size={20} /> Verified</>
            ) : (
              <><MdCancel className="text-red-600" size={20} /> Not Verified</>
            )}
          </p>
          <p className="mt-2 flex items-center gap-2 justify-center md:justify-start text-base font-semibold">

          </p>
        </div>
      </div>

      {/* ====== Area Chart ====== */}
      <div className="bg-white p-6 border-2 border-red-300 mb-8 ">
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={v => `$${v.toFixed(2)}`} />
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

      {/* ====== Bar Chart ====== */}
      <div className="bg-white p-6 border-2 border-red-300 mb-8 ">
        <h4 className="text-2xl font-bold text-red-700 mb-4 text-center">
          Salary History (Bar Chart)
        </h4>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">No salary data to plot.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={history} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={v => `$${v.toFixed(2)}`} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="salary" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ====== Payment Records ====== */}
      <div className="mt-12">
        <h4 className="text-2xl font-bold text-center text-red-600 mb-6">
          Payment Records
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rawPayments.map((p, i) => (
            <div
              key={i}
              className="card shadow-md border border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="card-body space-y-2">
                <h2 className="card-title text-lg text-red-500">
                  <FaCalendarAlt className="text-red-500 mr-2" />
                  {`${p.month.slice(0, 3)} ${p.year}`}
                </h2>

                <div className="flex items-center gap-2 text-gray-700">
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
