import React, { useState, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import UseAxios from "../../../Hooks/UseAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { ThemeContext } from "../../../Theme/ThemeProvider";

const PaymentForm = ({ salary, payrollId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxios();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      setProcessing(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: "Md Asif", // চাইলে ডাইনামিক করো
            email: "asif@example.com",
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        try {
          const res = await axiosSecure.patch(`/payroll/pay/${payrollId}`, {
            transactionId,
          });

          if (res.data?.paid) {
            setSuccess("✅ Payment successful and payroll updated!");

            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              html: `<p>Your payment has been processed.</p>
                     <p><b>Transaction ID:</b><br/><code>${transactionId}</code></p>`,
              confirmButtonColor: "#dc2626",
            }).then(() => {
              navigate("/dashboard/payroll");
            });
          } else {
            setError("⚠️ Payment succeeded but payroll update failed.");
          }
        } catch (updateError) {
          console.error(updateError);
          setError("⚠️ Payment succeeded but failed to update server.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("❌ Unexpected error occurred.");
    }

    setProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-6 max-w-xl mx-auto p-6 r transition-colors duration-300
        ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-white border-gray-300 text-gray-800"
        }`}
    >
      {/* Stripe Card Element with Border */}
      <div
        className={`p-3 rounded-md border focus-within:ring-2 transition ${
          theme === "dark"
            ? "bg-gray-950 border-gray-700 focus-within:ring-red-500"
            : "bg-gray-50 border-gray-300 focus-within:ring-red-600"
        }`}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                color: theme === "dark" ? "#E5E7EB" : "#1F2937",
                "::placeholder": {
                  color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      {/* Error / Success Messages */}
      {error && (
        <p className="text-red-500 mt-3 text-center font-medium">{error}</p>
      )}
      {success && (
        <p className="text-green-500 mt-3 text-center font-medium">{success}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`mt-6 w-full py-3 rounded-md text-white font-semibold transition-colors duration-300
          ${
            processing
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
      >
        {processing ? "Processing..." : `Pay ৳${salary}`}
      </button>
    </form>
  );
};

export default PaymentForm;
