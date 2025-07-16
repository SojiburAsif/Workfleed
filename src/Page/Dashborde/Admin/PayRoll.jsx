import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaEnvelope } from "react-icons/fa";  // <-- ইমেইল আইকন ইমপোর্ট
import UseAxios from "../../../Hooks/UseAxios";
import LoadingCard from "../../Shared/LoadingCard";

const PayRoll = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("All Employees");
  const axiosSecure = UseAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/payroll/all");
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [axiosSecure]);

  const employeeList = useMemo(() => {
    const names = payments.map((p) => p.name);
    return ["All Employees", ...new Set(names)];
  }, [payments]);

  const handleSelect = (e) => setSelectedEmployee(e.target.value);

  const displayedPayments = useMemo(() => {
    return selectedEmployee === "All Employees"
      ? payments
      : payments.filter((p) => p.name === selectedEmployee);
  }, [payments, selectedEmployee]);

  const handlePay = (payment) => {
    if (payment.paid) return;

    const alreadyPaid = payments.find(
      (p) =>
        p.name === payment.name &&
        p.month === payment.month &&
        p.year === payment.year &&
        p.paid
    );

    if (alreadyPaid) {
      return Swal.fire({
        icon: "info",
        title: "Already Paid",
        text: `${payment.name} already received salary for ${payment.month} ${payment.year}`,
      });
    }

    Swal.fire({
      title: `Pay ৳${payment.salary} to ${payment.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsPaying(payment._id);
        navigate(`/dashboard/payment/${payment._id}`);
        setTimeout(() => setIsPaying(null), 1000);
      }
    });
  };

  if (loading) {
    return <LoadingCard></LoadingCard>
  }

  return (
    <div className="p-4">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-red-600 mb-6">
        Payroll Approval Requests
      </h2>

      {/* Filter Left Side with Gradient */}
      <div className="flex justify-start mb-4">
        <div className="p-2 rounded-lg flex items-center">
          <label className="mr-2 text-base font-medium text-gray-900">Filter:</label>
          <select
            value={selectedEmployee}
            onChange={handleSelect}
            className="px-4 py-2 focus:outline-none text-sm border-gray-300 focus:ring-2 focus:ring-red-500"
          >
            {employeeList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <table className="table w-full text-sm md:text-base">
          <thead className="bg-red-100 text-red-700 uppercase">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="hidden sm:table-cell">Email</th>
              <th>Salary</th>
              <th>Month</th>
              <th>Year</th>
              <th className="hidden md:table-cell">Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayments.length > 0 ? (
              displayedPayments.map((p, idx) => (
                <tr key={p._id} className="hover:bg-red-50 transition-all">
                  <td>{idx + 1}</td>
                  <td className="font-bold text-gray-800">{p.name}</td>
                  <td className="hidden sm:table-cell flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-red-600" />
                    {p.email}
                  </td>
                  <td className="badge mt-5 badge-outline badge-secondary">৳{p.salary}</td>
                  <td>{p.month}</td>
                  <td>{p.year}</td>
                  <td className="hidden md:table-cell">
                    {p.paymentDate ? format(new Date(p.paymentDate), "PPP") : "Not Paid"}
                  </td>
                  <td>
                    <button
                      onClick={() => handlePay(p)}
                      disabled={p.paid || isPaying === p._id}
                      className={`px-5 py-2 rounded-full text-white text-sm font-semibold transition duration-300 ease-in-out shadow-md ${
                        p.paid || isPaying === p._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                      }`}
                    >
                      {p.paid ? "Paid" : isPaying === p._id ? "Paying..." : "Pay"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  No payroll requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayRoll;
