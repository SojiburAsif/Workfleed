import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxios from '../../../Hooks/UseAxios';
import {
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaUserAlt,
  FaEnvelope,
  FaHourglassHalf,
  FaReceipt,
} from 'react-icons/fa';
import LoadingCard from '../../Shared/LoadingCard';

const PAGE_SIZE = 5;

const PayEmploy = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = UseAuth();
  const axiosSecure = UseAxios();

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);

    axiosSecure
      .get(`/payroll/by-email?email=${encodeURIComponent(
        user.email.toLowerCase()
      )}&page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => {
        setPayments(res.data.data);
        setTotalPages(Math.ceil(res.data.totalCount / PAGE_SIZE));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching payment history:', err);
        Swal.fire('Error', 'Failed to fetch payment history', 'error');
        setLoading(false);
      });
  }, [user?.email, axiosSecure, page]);

  const sortedPayments = payments.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month.localeCompare(b.month);
  });

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-2 md:p-4 mx-auto max-w-7xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-red-600 flex items-center justify-center gap-2">
        <FaMoneyCheckAlt /> Payment History
      </h2>

      {loading ? (
        <LoadingCard />
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-700 text-sm">
          No payment records found.
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block border border-gray-300 rounded-md shadow-sm overflow-hidden">
            <table className="table-fixed w-full text-sm">
              <thead className="bg-red-100 text-red-700 font-semibold text-sm ">
                <tr>
                  <th className="border px-2 py-1 text-left">
                    <div className="flex items-center gap-1">
                      <FaUserAlt className="text-red-500" />
                      Name
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-left">
                    <div className="flex items-center gap-1">
                      <FaEnvelope className="text-red-500" />
                      Email
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-left">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-red-500" />
                      Month
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-left">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-red-500" />
                      Year
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <FaMoneyCheckAlt className="text-red-500" />
                      Amount (৳)
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FaHourglassHalf className="text-red-500" />
                      Status
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FaReceipt className="text-red-500" />
                      Transaction ID
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FaCalendarAlt className="text-red-500" />
                      Payment Date
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-left">
                    <div className="flex items-center gap-1">
                      <FaUserAlt className="text-red-500" />
                      Requested By
                    </div>
                  </th>
                  <th className="border px-2 py-1 text-left">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-red-500" />
                      Requested At
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-red-50">
                    <td className="border px-2 py-1 truncate">
                      {pay.name || 'N/A'}
                    </td>
                    <td className="border px-2 py-1 truncate">
                      {pay.email || 'N/A'}
                    </td>
                    <td className="border px-2 py-1">{pay.month}</td>
                    <td className="border px-2 py-1">{pay.year}</td>
                    <td className="border px-2 py-1 text-right">
                      {Number(pay.salary || pay.amount).toFixed(2)}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center font-semibold ${
                        pay.status === 'paid'
                          ? 'text-green-600'
                          : pay.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {pay.status
                        ?.charAt(0)
                        .toUpperCase() + pay.status?.slice(1)}
                    </td>
                    <td className="border px-2 py-1 text-center font-mono text-xs break-all max-w-[80px] truncate">
                      {pay.transactionId || 'N/A'}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {pay.paymentDate
                        ? new Date(pay.paymentDate).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="border px-2 py-1 truncate">
                      {pay.requestedBy || 'N/A'}
                    </td>
                    <td className="border px-2 py-1 truncate">
                      {pay.requestedAt
                        ? new Date(pay.requestedAt).toLocaleString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {sortedPayments.map((pay) => (
              <div
                key={pay._id}
                className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm text-sm"
              >
                <h3 className="text-lg font-semibold text-red-600 mb-1 flex items-center gap-1 truncate">
                  <FaUserAlt /> {pay.name || 'N/A'}
                </h3>
                <p className="flex items-center gap-1 truncate">
                  <FaEnvelope /> {pay.email || 'N/A'}
                </p>
                <p className="flex items-center gap-1">
                  <FaCalendarAlt /> {pay.month} {pay.year}
                </p>
                <p className="flex items-center gap-1">
                  <FaMoneyCheckAlt /> ৳{Number(pay.salary || pay.amount).toFixed(2)}
                </p>
                <p className="flex items-center gap-1">
                  <FaHourglassHalf />{' '}
                  <span
                    className={`font-semibold ${
                      pay.status === 'paid'
                        ? 'text-green-600'
                        : pay.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {pay.status
                      ?.charAt(0)
                      .toUpperCase() + pay.status?.slice(1)}
                  </span>
                </p>
                <p className="flex items-center gap-1 truncate">
                  <FaReceipt /> {pay.transactionId || 'N/A'}
                </p>
                <p className="flex items-center gap-1">
                  <FaCalendarAlt />{' '}
                  {pay.paymentDate
                    ? new Date(pay.paymentDate).toLocaleString()
                    : 'N/A'}
                </p>
                <p className="flex items-center gap-1 truncate">
                  <FaUserAlt /> {pay.requestedBy || 'N/A'}
                </p>
                <p className="flex items-center gap-1 truncate">
                  <FaCalendarAlt />{' '}
                  {pay.requestedAt
                    ? new Date(pay.requestedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-4 text-sm">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md font-semibold ${
                page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Previous
            </button>
            <span className="self-center text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md font-semibold ${
                page === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PayEmploy;
