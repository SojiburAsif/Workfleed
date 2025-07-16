import React, { useEffect, useState, useMemo } from 'react';
import { FaUserTie, FaCalendarAlt, FaClock } from 'react-icons/fa';
import UseAxios from '../../../Hooks/UseAxios';
import PRLoading from '../../Shared/PRLoading';


const Progress = () => {
  const axiosSecure = UseAxios();

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true); // ✅ Loading state added

  // Months list
  const months = useMemo(() => [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ], []);

  // Load data initially
  useEffect(() => {
    setLoading(true);
    axiosSecure.get('/works')
      .then(res => {
        setRecords(res.data);

        const seen = new Set();
        const uniqueEmployees = [];

        res.data.forEach(work => {
          if (!seen.has(work.userEmail)) {
            seen.add(work.userEmail);
            uniqueEmployees.push({
              email: work.userEmail,
              name: work.name || work.userEmail.split('@')[0],
            });
          }
        });

        setEmployees(uniqueEmployees);
      })
      .catch(err => console.error('Error loading works:', err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  // Load filtered data
  useEffect(() => {
    setLoading(true);
    let url = '/works';
    const params = [];

    if (selectedMonth) params.push(`month=${selectedMonth}`);
    if (selectedEmail) params.push(`email=${selectedEmail}`);
    if (params.length) url += `?${params.join('&')}`;

    axiosSecure.get(url)
      .then(res => setRecords(res.data))
      .catch(err => console.error('Error loading filtered works:', err))
      .finally(() => setLoading(false));
  }, [selectedEmail, selectedMonth, axiosSecure]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-500">
        Employee Work Progress
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-base text-black">Employee</span>
          </label>
          <select
            className="select select-bordered rounded-4xl w-full"
            value={selectedEmail}
            onChange={e => setSelectedEmail(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.email} value={emp.email}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-black text-base">Month</span>
          </label>
          <select
            className="select select-bordered rounded-4xl w-full"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {months.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading or Data */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PRLoading key={i} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <p className="text-center text-red-500 font-semibold">
          No work records found. Please adjust filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(record => (
            <div
              key={record._id}
              className="card bg-base-100 border border-gray-200 rounded-2xl p-5 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
                <FaUserTie /> {record.name || 'Unnamed'}
              </h3>
              <p className="text-gray-700 mb-2"><strong>Task:</strong> {record.task}</p>
              <p className="text-gray-700 mb-2 flex items-center gap-2">
                <FaClock className="text-red-500" /> <strong>Hours:</strong> {record.hours}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" /> <strong>Date:</strong>{' '}
                {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Progress;
