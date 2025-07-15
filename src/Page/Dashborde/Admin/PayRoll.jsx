import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import UseAxios from "../../../Hooks/UseAxios";

const PayRoll = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("All Employees");
  const axiosSecure = UseAxios();

  // Fetch all payrolls
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/payroll/all");
        setPayments(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch payments:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [axiosSecure]);

  // Unique employee list for dropdown
  const employeeList = useMemo(() => {
    const names = payments.map((p) => p.name);
    const unique = Array.from(new Set(names));
    return ["All Employees", ...unique];
  }, [payments]);

  // Handle dropdown change
  const handleSelect = (e) => {
    setSelectedEmployee(e.target.value);
  };

  // Filtered payments based on selection
  const displayedPayments = useMemo(() => {
    return selectedEmployee === "All Employees"
      ? payments
      : payments.filter((p) => p.name === selectedEmployee);
  }, [payments, selectedEmployee]);

  // Handle Pay button
  const handlePay = async (paymentId) => {
    if (!window.confirm("Are you sure you want to process this payment?"))
      return;
    try {
      setIsPaying(paymentId);
      const res = await axiosSecure.patch(`/payroll/pay/${paymentId}`);
      const updated = res.data;
      setPayments((prev) =>
        prev.map((item) =>
          item._id === paymentId ||
          item._id?.toString() === paymentId?.toString()
            ? { ...item, paid: true, paymentDate: updated.paymentDate }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Payment failed:", err?.message || err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsPaying(null);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold">Payroll Approval Requests</h2>

      {/* Employee Filter */}
      <div>
        <label className="mr-4 font-medium">Filter by Employee:</label>
        <select
          value={selectedEmployee}
          onChange={handleSelect}
          className="border rounded px-3 py-1"
        >
          {employeeList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Employee Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Salary</th>
              <th className="p-3 border">Month</th>
              <th className="p-3 border">Year</th>
              <th className="p-3 border">Payment Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayments.map((payment, idx) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="p-3 border">{idx + 1}</td>
                <td className="p-3 border">{payment.name}</td>
                <td className="p-3 border">{payment.email}</td>
                <td className="p-3 border">৳ {payment.salary}</td>
                <td className="p-3 border">{payment.month}</td>
                <td className="p-3 border">{payment.year}</td>
                <td className="p-3 border">
                  {payment.paymentDate
                    ? format(new Date(payment.paymentDate), "PPP")
                    : "Not Paid"}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() => handlePay(payment._id)}
                    disabled={payment.paid || isPaying === payment._id}
                    className={`px-4 py-1 rounded text-white transition duration-200 ${
                      payment.paid || isPaying === payment._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {payment.paid
                      ? "Paid"
                      : isPaying === payment._id
                      ? "Paying..."
                      : "Pay"}
                  </button>
                </td>
              </tr>
            ))}
            {displayedPayments.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayRoll;
