import React, { useEffect, useState } from 'react';


import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxios from '../../../Hooks/UseAxios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = UseAuth();
  const axiosSecure = UseAxios();

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);

    // API থেকে ওই ইউজারের পেমেন্ট হিস্টোরি লোড করা
    axiosSecure
      .get(`/payroll?email=${user.email}`)
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching payment history:', err);
        Swal.fire('Error', 'Failed to fetch payment history', 'error');
        setLoading(false);
      });
  }, [user?.email, axiosSecure]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Payment History</h2>

      {loading ? (
        <p className="text-center">Loading payment history...</p>
      ) : payments.length === 0 ? (
        <p className="text-center">No payment records found.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Amount (৳)</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{pay.month}</td>
                <td className="border px-4 py-2">{pay.year}</td>
                <td className="border px-4 py-2">{Number(pay.salary || pay.amount).toFixed(2)}</td>
                <td className={`border px-4 py-2 font-semibold ${
                  pay.status === 'paid' ? 'text-green-600' : 
                  pay.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                </td>
                <td className="border px-4 py-2">
                  {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
