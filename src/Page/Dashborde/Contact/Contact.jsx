import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import UseAxios from '../../../Hooks/UseAxios';

const Contact = () => {
    const axiosSecure = UseAxios();
    const [formData, setFormData] = useState({
        email: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, message } = formData;
        if (!email || !message) {
            return Swal.fire('Oops', 'Please fill out both fields', 'warning');
        }
        setSubmitting(true);
        try {
            await axiosSecure.post('/contact-us', { email, message });
            Swal.fire('Sent!', 'Your message has been sent.', 'success');
            setFormData({ email: '', message: '' });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to send message.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg  mt-10">
            <h1 className="text-4xl font-bold text-center mb-8 text-red-600">✉ Contact Us</h1>

            {/* Dummy Address */}

            <div className=" " >
                <div className="mb-8 space-y-4 ">
                    <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-red-500 mt-1" />
                        <div>
                            <p className="font-semibold">1234 React Avenue</p>
                            <p>Frontend City, JS 56789</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaPhoneAlt className="text-red-500" />
                        <p>+1 (234) 567‑8901</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaEnvelope className="text-red-500" />
                        <p>support@dummycompany.com</p>
                    </div>
                </div>


                <form onSubmit={handleSubmit} className="space-y-6 ">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Your Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Message</span>
                        </label>
                        <textarea
                            name="message"
                            placeholder="Your message..."
                            value={formData.message}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full h-32 resize-none"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`btn bg-red-500 hover:bg-red-600 text-white px-8 py-2 ${submitting ? 'loading' : ''
                                }`}
                        >
                            {submitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>

            </div>

            {/* Contact Form */}

        </div>
    );
};

export default Contact;
