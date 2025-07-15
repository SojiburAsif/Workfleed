import React, { useEffect, useState } from 'react';
import { FaUserTie, FaCalendarAlt, FaClock } from 'react-icons/fa';
import UseAxios from '../../../Hooks/UseAxios';

const Progress = () => {
  const axiosSecure = UseAxios();

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // মাসের নাম ও তার ভ্যালু (MM ফরম্যাটে)
  const months = [
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
  ];

  // প্রথমে সব কাজ ও এমপ্লয়িদের লোড করা (unique employee list সহ)
  useEffect(() => {
    axiosSecure.get('/works')
      .then(res => {
        setRecords(res.data);

        // unique employees
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
      .catch(err => console.error('Error loading works:', err));
  }, [axiosSecure]);


  useEffect(() => {
  
    if (!selectedMonth && !selectedEmail) {
      axiosSecure.get('/works')
        .then(res => setRecords(res.data))
        .catch(err => console.error('Error loading default records:', err));
      return;
    }

    // মাস সিলেক্ট করা হলে url এ month param যোগ করা হবে
    // employee email থাকলে url এ email param যোগ হবে
    let url = `/works?`;
    if (selectedMonth) url += `month=${selectedMonth}`;
    if (selectedEmail) url += `${selectedMonth ? '&' : ''}email=${selectedEmail}`;

    axiosSecure.get(url)
      .then(res => setRecords(res.data))
      .catch(err => console.error('Error loading filtered data:', err));
  }, [selectedEmail, selectedMonth, axiosSecure]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Employee Work Progress
      </h2>

    

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <select
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none"
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

        <select
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none"
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

      {/* Work Records */}
      {records.length === 0 ? (
        <>
          <p className="text-center text-red-500 font-semibold">
            No work records found. Please check filters or try again later.
          </p>
          {/*
            ডাটা না থাকলে এই মেসেজ দেখানো হবে,
            HR এবং ইউজাররা বুঝতে পারবে কোন কারণে ডাটা নেই
          */}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(record => (
            <div
              key={record._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <FaUserTie className="text-indigo-500" /> {record.name || 'Unnamed'}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Task:</strong> {record.task}
              </p>
              <p className="text-gray-700 mb-1 flex items-center gap-1">
                <FaClock className="text-yellow-500" /> <strong>Hours:</strong> {record.hours}
              </p>
              <p className="text-gray-700 flex items-center gap-1">
                <FaCalendarAlt className="text-green-500" /> <strong>Date:</strong>{' '}
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
