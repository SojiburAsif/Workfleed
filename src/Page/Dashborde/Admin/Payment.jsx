import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import UseAxios from "../../../Hooks/UseAxios";
import LoadingCard from "../../Shared/LoadingCard";

const stripePromise = loadStripe(import.meta.env.VITE_PAY_Key);

const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = UseAxios();
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

  if (error) return <div className="text-center text-red-600 mt-10 font-semibold">{error}</div>;

  if (!payment) return <div className="text-center text-red-600 mt-10 font-semibold">Payment not found.</div>;

  const {
    name, email, salary, month, year, paid,
    paymentDate, requestedBy, requestedAt, status,
  } = payment;

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">Confirm Salary Payment</h2>

      <div className="space-y-3 text-gray-800 text-base">
        <p><span className="font-semibold">Name:</span> {name}</p>
        <p><span className="font-semibold">Email:</span> {email}</p>
        <p><span className="font-semibold">Salary:</span> ৳{salary}</p>
        <p><span className="font-semibold">Month:</span> {month}</p>
        <p><span className="font-semibold">Year:</span> {year}</p>
        <p><span className="font-semibold">Requested By:</span> {requestedBy}</p>
        <p><span className="font-semibold">Requested At:</span> {new Date(requestedAt).toLocaleString()}</p>
        <p>
          <span className="font-semibold">Payment Status:</span>{" "}
          <span className={paid ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {status?.toUpperCase() || (paid ? "PAID" : "UNPAID")}
          </span>
        </p>
        {paid && (
          <>
            <p><span className="font-semibold">Paid At:</span> {new Date(paymentDate).toLocaleString()}</p>
            {payment.transactionId && (
              <p><span className="font-semibold">Transaction ID:</span> <code>{payment.transactionId}</code></p>
            )}
          </>
        )}
      </div>

      {!paid && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm salary={salary} payrollId={payment._id} clientSecret={clientSecret} />
        </Elements>
      )}

      {paid && (
        <button className="mt-6 w-full bg-gray-400 cursor-not-allowed text-white py-2 rounded-md font-semibold" disabled>
          Already Paid
        </button>
      )}
    </div>
  );
};

export default PaymentPage;
