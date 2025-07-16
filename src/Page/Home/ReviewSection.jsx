import React from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const reviews = [
  {
    title: 'Great features & easy to use',
    name: 'Renee Simms',
    date: '11 Dec',
    content:
      'Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit.',
  },
  {
    title: 'Amazing swipe gestures!',
    name: 'Johnny Simpson',
    date: '3 Dec',
    content:
      'Proin condimentum nulla ac eu felis dapibus condimentum sit amet a augue.',
  },
  {
    title: 'Best experience ever!',
    name: 'Calla Wang',
    date: '27 Nov',
    content:
      'Felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet.',
  },
  {
    title: 'Super simple & fun to use',
    name: 'Leo Gill',
    date: '19 Nov',
    content:
      'Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam pharetra.',
  },
  {
    title: 'Advanced but user-friendly',
    name: 'Jennifer Smith',
    date: '30 Oct',
    content:
      'Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat.',
  },
];

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ReviewSection = () => {
  return (
    <section className="bg-gradient-to-b from-white via-red-50 to-white py-20 px-6 md:px-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-widest text-red-500">
            User Feedback
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-3">
            What People Are Saying
          </h2>
          <div className="flex justify-center items-center gap-2 mt-4 text-red-500">
            <span className="text-6xl font-bold">4.9</span>
            <FaStar size={36} />
          </div>
          <p className="text-gray-500 text-sm mt-2">Based on 1,900+ ratings</p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-t-4 border-red-500"
              variants={fadeInUpVariant}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                {review.title}
              </h4>
              <div className="flex text-red-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 ">“ {review.content} ”</p>
              <p className="text-xs text-gray-500">
                {review.date} • {review.name}
              </p>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:scale-105 transition-transform duration-300"
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.7, delay: reviews.length * 0.15 + 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-white" />
                ))}
              </div>
              <h4 className="text-xl font-semibold mb-2">Join 1,900+ Happy Users</h4>
              <p className="text-sm opacity-90">
                Trusted by users across the world. Your satisfaction is our top priority.
              </p>
            </div>
            <button className="mt-6 py-2 px-4 border border-white rounded-full hover:bg-white hover:text-red-500 transition">
              DOWNLOAD NOW
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
