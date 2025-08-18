import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import UseAxios from "../../../Hooks/UseAxios";
import LoadingCard from "../../Shared/LoadingCard";
import { ThemeContext } from "../../../Theme/ThemeProvider";
import { FaMoneyCheckAlt, FaArrowLeft } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_PAY_Key);

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = UseAxios();
  const { theme } = useContext(ThemeContext);

  const [payment, setPayment] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPaymentInfo = async () => {
      try {
        const res = await axiosSecure.get(`/payroll/${id}`);
        setPayment(res.data);

        if (!res.data.paid) {
          const intentRes = await axiosSecure.post("/create-payment-intent", {
            amount: res.data.salary,
            payrollId: res.data._id,
          });
          setClientSecret(intentRes.data.clientSecret);
        }
      } catch (err) {
        console.error("❌ Error loading payment:", err);
        setError("❌ Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) getPaymentInfo();
    else {
      setLoading(false);
      setError("❌ Invalid payment ID.");
    }
  }, [id, axiosSecure]);

  if (loading) return <LoadingCard />;

  if (error)
    return (
      <div className="text-center text-red-600 mt-10 font-semibold px-4">
        {error}
      </div>
    );

  if (!payment)
    return (
      <div className="text-center text-red-600 mt-10 font-semibold px-4">
        Payment not found.
      </div>
    );

  const {
    name,
    email,
    salary,
    month,
    year,
    paid,
    paymentDate,
    requestedBy,
    requestedAt,
    status,
  } = payment;

  return (
    <div
      className={`max-w-3xl mx-auto mt-8 sm:mt-12 p-4 sm:p-6 md:p-8 rounded-lg shadow-md border transition-colors duration-300
      ${theme === "dark"
          ? "bg-gray-950 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-800"
        }`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-red-500 hover:text-red-700"
      >
        <FaArrowLeft className="shrink-0" /> Back
      </button>

      <h2
        className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2 leading-snug
        ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
      >
        <FaMoneyCheckAlt className="text-lg sm:text-xl md:text-2xl" />
        Confirm Salary Payment
      </h2>

      {/* Details Section */}
      <div className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
        <p>
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {email}
        </p>
        <p>
          <span className="font-semibold">Salary:</span> ৳{salary}
        </p>
        <p>
          <span className="font-semibold">Month:</span> {month}
        </p>
        <p>
          <span className="font-semibold">Year:</span> {year}
        </p>
        <p>
          <span className="font-semibold">Requested By:</span> {requestedBy}
        </p>
        <p>
          <span className="font-semibold">Requested At:</span>{" "}
          {new Date(requestedAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Payment Status:</span>{" "}
          <span
            className={
              paid ? "text-green-500 font-bold" : "text-red-500 font-bold"
            }
          >
            {status?.toUpperCase() || (paid ? "PAID" : "UNPAID")}
          </span>
        </p>

        {paid && (
          <>
            <p>
              <span className="font-semibold">Paid At:</span>{" "}
              {new Date(paymentDate).toLocaleString()}
            </p>
            {payment.transactionId && (
              <p className="break-words">
                <span className="font-semibold">Transaction ID:</span>{" "}
                <code>{payment.transactionId}</code>
              </p>
            )}
          </>
        )}
      </div>

      {/* Payment Form */}
      {!paid && clientSecret && (
        <div className="mt-6 sm:mt-8">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              salary={salary}
              payrollId={payment._id}
              clientSecret={clientSecret}
            />
          </Elements>
        </div>
      )}

      {/* Already Paid Button */}
      {paid && (
        <button
          className="mt-6 w-full bg-gray-400 cursor-not-allowed text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base"
          disabled
        >
          Already Paid
        </button>
      )}
    </div>
  );
};

export default PaymentPage;
