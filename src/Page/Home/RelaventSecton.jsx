import React from 'react';
import { FiTrendingUp, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ShopSupport = () => {
  return (
    <section className="bg-red-950 text-white py-20 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUpVariant}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* Left: Checkout Highlight */}
        <motion.div
          className="p-8 rounded-xl"
          variants={fadeInUpVariant}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white">
            The world’s highest-converting checkout system
          </h2>

          <div className="flex flex-col sm:flex-row justify-between gap-10 mt-12">
            <div className="flex items-center gap-4">
              <FiTrendingUp className="text-red-500 text-4xl" />
              <div>
                <h4 className="uppercase text-white text-sm">Improved Conversion Rate</h4>
                <h2 className="text-5xl font-bold text-white">15%</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiUsers className="text-red-500 text-4xl" />
              <div>
                <h4 className="uppercase text-white text-sm">Active Buyer Network</h4>
                <h2 className="text-5xl font-bold text-white">150M+</h2>
              </div>
            </div>
          </div>

          <p className="mt-10 text-white leading-relaxed">
            <span className="text-red-400 underline cursor-pointer">WorkFleed</span> outperforms other platforms with a 15% higher average conversion rate — giving you access to over 150 million ready-to-buy customers.
          </p>

          <p className="mt-4 text-white text-sm">
            Based on an independent study conducted by a Big Three global consulting firm (April 2023).
          </p>
        </motion.div>

        {/* Right: HR & Employee Management */}
        <motion.div
          variants={fadeInUpVariant}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            Smarter Tools for Managing Your Team
          </h2>
          <p className="text-lg text-white mb-10">
            Empower your business with a streamlined solution to track productivity, optimize workflows, and manage employees efficiently — all from a single platform.
          </p>

          <div className="space-y-6">
            <motion.div
              className="border-l-4 border-red-500 pl-4"
              variants={fadeInUpVariant}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: false }}
            >
              <h3 className="text-xl font-semibold text-white">Real-Time Team Activity</h3>
              <p className="text-white">Monitor employee engagement and task progress as it happens — stay informed and agile.</p>
            </motion.div>

            <motion.div
              className="border-l-4 border-red-500 pl-4"
              variants={fadeInUpVariant}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: false }}
            >
              <h3 className="text-xl font-semibold text-white">Insightful Daily Reports</h3>
              <p className="text-white">Understand who’s contributing and how — with clear daily summaries and analytics.</p>
            </motion.div>

            <motion.div
              className="border-l-4 border-red-500 pl-4"
              variants={fadeInUpVariant}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: false }}
            >
              <h3 className="text-xl font-semibold text-white">Fully Integrated HR Tools</h3>
              <p className="text-white">Automate onboarding, attendance, payroll, and more — giving your HR team more control with less effort.</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ShopSupport;
