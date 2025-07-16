import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount, onSuccessfulPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    // Create payment method
    const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (createError) {
      setError(createError.message);
      setProcessing(false);
      return;
    }

    // Normally here you'd send paymentMethod.id & amount to your backend to create payment intent and confirm payment

    // For demo, we simulate success
    setTimeout(() => {
      setProcessing(false);
      onSuccessfulPayment && onSuccessfulPayment(paymentMethod.id);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#a0aec0',
              },
            },
            invalid: {
              color: '#fa755a',
            },
          },
        }}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 rounded text-white font-semibold ${
          processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;
