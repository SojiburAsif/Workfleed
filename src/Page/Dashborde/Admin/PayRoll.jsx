import React, { useEffect, useState, useMemo, useContext } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaEnvelope, FaMoneyCheckAlt, FaList, FaThLarge } from "react-icons/fa";
import UseAxios from "../../../Hooks/UseAxios";
import LoadingCard from "../../Shared/LoadingCard";
import { ThemeContext } from "../../../Theme/ThemeProvider";

const PayRoll = () => {
  const { theme } = useContext(ThemeContext); // <-- theme context
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("All Employees");
  const [viewMode, setViewMode] = useState("table"); // table | card
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
    return <LoadingCard />;
  }

  // Theme-based classes
  const bgClass = theme === "dark" ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-950 border-gray-900" : "bg-white border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-800 text-red-400" : "bg-red-100 text-red-700";
  const tableRowHover = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-red-50";

  return (
    <div className={`p-4 min-h-screen transition-colors duration-300 ${bgClass}`}>
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`flex items-center gap-2 text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
          <FaMoneyCheckAlt className={theme === "dark" ? "text-red-400" : "text-red-600"} />
          Payroll Approval Requests
        </h2>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg ${
              viewMode === "table"
                ? "bg-red-600 text-white"
                : theme === "dark"
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <FaList />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`p-2  ${
              viewMode === "card"
                ? "bg-red-600 text-white"
                : theme === "dark"
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <FaThLarge />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-start mb-4">
        <div className="p-2 rounded-lg flex items-center">
          <label className={`mr-2 text-base font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
            Filter:
          </label>
          <select
            value={selectedEmployee}
            onChange={handleSelect}
            className={`px-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 ${
              theme === "dark"
                ? "bg-gray-950 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {employeeList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className={`overflow-x-auto rounded-lg shadow-md border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <table className="table w-full text-sm md:text-base">
            <thead className={`${tableHeaderBg} uppercase`}>
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
                  <tr key={p._id} className={`${tableRowHover} transition-all`}>
                    <td>{idx + 1}</td>
                    <td className="font-bold">{p.name}</td>
                    <td className="hidden sm:table-cell flex items-center gap-2">
                      <FaEnvelope className={theme === "dark" ? "text-red-400" : "text-red-600"} /> {p.email}
                    </td>
                    <td>
                      <span className={`badge badge-outline badge-secondary ${theme === "dark" ? "dark:border-gray-500 dark:text-gray-200" : ""}`}>
                        ৳{p.salary}
                      </span>
                    </td>
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
                            ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
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
                  <td colSpan="8" className="text-center py-10">
                    No payroll requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {displayedPayments.length > 0 ? (
            displayedPayments.map((p) => (
              <div
                key={p._id}
                className={`shadow-md rounded-xl p-6 border ${cardBg}`}
              >
                <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">{p.name}</h3>
                <p className="flex items-center gap-2 text-sm mb-2 text-gray-700 dark:text-gray-300">
                  <FaEnvelope className={theme === "dark" ? "text-red-400" : "text-red-500"} /> {p.email}
                </p>
                <p className="text-sm mb-1"><span className="font-medium">Salary:</span> ৳{p.salary}</p>
                <p className="text-sm mb-1"><span className="font-medium">Month:</span> {p.month}</p>
                <p className="text-sm mb-1"><span className="font-medium">Year:</span> {p.year}</p>
                <p className="text-sm mb-3"><span className="font-medium">Payment Date:</span> {p.paymentDate ? format(new Date(p.paymentDate), "PPP") : "Not Paid"}</p>
                <button
                  onClick={() => handlePay(p)}
                  disabled={p.paid || isPaying === p._id}
                  className={`w-full py-2 rounded-md text-white text-sm font-semibold transition duration-300 ease-in-out shadow-md ${
                    p.paid || isPaying === p._id
                      ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                  }`}
                >
                  {p.paid ? "Paid" : isPaying === p._id ? "Paying..." : "Pay"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
              No payroll requests found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PayRoll;
