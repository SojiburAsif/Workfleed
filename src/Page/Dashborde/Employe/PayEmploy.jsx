/* PayEmploy.js */
import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxios from '../../../Hooks/UseAxios';
import {
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaHourglassHalf,
  FaReceipt,
  FaRegCopy,
  FaThLarge,
  FaThList,
} from 'react-icons/fa';
import LoadingCard from '../../Shared/LoadingCard';
import { ThemeContext } from '../../../Theme/ThemeProvider';

const PAGE_SIZE = 5;

const formatAmount = (v) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));

const PayEmploy = () => {
  const { theme } = useContext(ThemeContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // table | card

  const { user } = UseAuth();
  const axiosSecure = UseAxios();

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);

    axiosSecure
      .get(
        `/payroll/by-email?email=${encodeURIComponent(
          user.email.toLowerCase()
        )}&page=${page}&limit=${PAGE_SIZE}`
      )
      .then((res) => {
        setPayments(res.data.data || []);
        setTotalPages(Math.max(1, Math.ceil((res.data.totalCount || 0) / PAGE_SIZE)));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching payment history:', err);
        Swal.fire('Error', 'Failed to fetch payment history', 'error');
        setLoading(false);
      });
  }, [user?.email, axiosSecure, page]);

  const sortedPayments = [...payments].sort((a, b) => {
    const da = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
    const db = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
    return db - da;
  });

  const handlePrev = () => { if (page > 1) setPage(p => p - 1); };
  const handleNext = () => { if (page < totalPages) setPage(p => p + 1); };

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text || ''); Swal.fire({ icon: 'success', title: 'Copied', text: 'Transaction ID copied.' }); }
    catch { Swal.fire({ icon: 'error', title: 'Oops', text: 'Could not copy.' }); }
  };

  // THEME CLASSES
  const wrapperBg = theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-900 border border-gray-800 text-gray-100' : 'bg-white border border-gray-200 text-gray-900';
  const tableHeadBg = theme === 'dark' ? 'bg-gray-850 text-red-300' : 'bg-red-50 text-red-700';
  const rowHover = theme === 'dark' ? 'hover:bg-gray-850' : 'hover:bg-red-50';
  const muted = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const subtle = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const pageBtnEnabled = 'bg-red-600 text-white hover:bg-red-700';
  const pageBtnDisabled = 'bg-gray-300 text-gray-600 cursor-not-allowed';
  const text = theme === 'dark' ? 'text-white' : 'text-black';

  return (
    <div className={`p-3 md:p-6 mx-auto max-w-7xl transition-colors duration-300 ${wrapperBg}`}>
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-red-100'}`}>
            <FaMoneyCheckAlt className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} size={20} />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Payment History</h1>
            <p className={`text-sm ${muted}`}>Your salary / payroll records</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'}`}
              title="Table View"
            ><FaThList /></button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded ${viewMode === 'card' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'}`}
              title="Card View"
            ><FaThLarge /></button>
          </div>
          <div className={`px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900 border border-gray-200'}`}>
            <div className="text-sm">{payments.length} record{payments.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </header>

      {loading ? <LoadingCard /> : payments.length === 0 ? <div className={`py-12 text-center ${muted}`}>No payment records found.</div> : (
        <>
          {/* Table View */}
          {viewMode === 'table' && (
            <div className={`hidden md:block rounded-xl overflow-hidden shadow ${theme === 'dark' ? 'border border-gray-800' : 'border border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead className={`${tableHeadBg} text-left`}>
                    <tr>
                      <th className="px-5 py-3 border-b">Name</th>
                      <th className="px-5 py-3 border-b">Email</th>
                      <th className="px-3 py-3 border-b text-center">Month</th>
                      <th className="px-3 py-3 border-b text-center">Year</th>
                      <th className="px-4 py-3 border-b text-right">Amount</th>
                      <th className="px-4 py-3 border-b text-center">Status</th>
                      <th className="px-4 py-3 border-b text-center">Transaction</th>
                      <th className="px-4 py-3 border-b text-center">Payment Date</th>
                      <th className="px-4 py-3 border-b">Requested By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPayments.map(p => (
                      <tr key={p._id} className={`${rowHover} transition-colors duration-200`}>
                        {/* Name */}
                        <td className="px-5 py-3 border-b font-medium">{p.name || 'N/A'}</td>

                        {/* Email */}
                        <td className="px-5 py-3 border-b text-sm break-all">{p.email || 'N/A'}</td>

                        {/* Month / Year */}
                        <td className="px-3 py-3 border-b text-center text-sm">{p.month}</td>
                        <td className="px-3 py-3 border-b text-center text-sm">{p.year}</td>

                        {/* Amount */}
                        <td className="px-4 py-3 border-b text-right font-semibold text-sm">৳{formatAmount(p.salary || p.amount || 0)}</td>

                        {/* Status */}
                        <td className="px-4 py-3 border-b text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'paid' ? 'bg-green-600 text-white' : p.status === 'pending' ? 'bg-red-500 text-white' : 'bg-red-600 text-white'}`}>
                            {p.status ? p.status[0].toUpperCase() + p.status.slice(1) : 'Unknown'}
                          </span>
                        </td>

                        {/* Transaction */}
                        <td className="px-4 py-3 border-b text-center">
                          <div className="flex items-center justify-center gap-2 max-w-[200px] mx-auto break-all">
                            <span className="text-xs font-mono">{p.transactionId || '—'}</span>
                            {p.transactionId && (
                              <button onClick={() => copyToClipboard(p.transactionId)} className="text-gray-400 hover:text-gray-600">
                                <FaRegCopy />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Payment Date */}
                        <td className="px-4 py-3 border-b text-center text-sm">{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : '—'}</td>

                        {/* Requested By */}
                        <td className="px-4 py-3 border-b text-sm">{p.requestedBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPayments.map(p => (
                <article key={p._id} className={`${cardBg} rounded-xl p-4 shadow-sm border ${subtle}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-semibold truncate ${text}`}>{p.name || 'N/A'}</h3>
                      <div className={`text-sm font-semibold ${text}`}>৳{formatAmount(p.salary || p.amount || 0)}</div>
                    </div>
                    <p className={`mt-1 text-sm ${text}`}><FaEnvelope className="inline mr-2 text-red-500" />{p.email || 'N/A'}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-2 ${text}`}><FaCalendarAlt className="text-red-500" />{p.month} {p.year}</div>
                      <div className={`flex items-center justify-end gap-2 ${text}`}>
                        <FaHourglassHalf className="text-red-500" />
                        <span className={`font-semibold ${p.status === 'paid' ? 'text-green-500' : p.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                          {p.status ? p.status[0].toUpperCase() + p.status.slice(1) : 'Unknown'}
                        </span>
                      </div>
                      <div className={`col-span-2 mt-2 text-xs flex items-center gap-2 break-all ${text}`}>
                        <FaReceipt className="text-red-500" />
                        <span className="truncate">{p.transactionId || 'N/A'}</span>
                        {p.transactionId && <button onClick={() => copyToClipboard(p.transactionId)} className={`ml-auto hover:text-gray-600 ${text}`}><FaRegCopy /></button>}
                      </div>
                    </div>
                    <div className={`mt-2 text-xs flex justify-between ${text}`}>
                      <div className="flex items-center gap-2"><FaCalendarAlt />{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}</div>
                      <div className="truncate">{p.requestedBy || '—'}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>


          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={handlePrev} disabled={page === 1} className={`px-4 py-2 rounded-md text-sm font-semibold ${page === 1 ? pageBtnDisabled : pageBtnEnabled}`}>Previous</button>
            <div className={`text-sm ${muted}`}>Page <strong className="mx-1">{page}</strong> of <strong>{totalPages}</strong></div>
            <button onClick={handleNext} disabled={page === totalPages} className={`px-4 py-2 rounded-md text-sm font-semibold ${page === totalPages ? pageBtnDisabled : pageBtnEnabled}`}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PayEmploy;
