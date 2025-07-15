import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaLock, FaHeadset, FaUserCheck } from 'react-icons/fa';

const features = [
  {
    icon: <FaCalendarCheck className="text-red-600 text-4xl" />,
    title: 'Effortless Project Scheduling',
    description: 'Plan and initiate your web development projects with ease and accuracy.',
  },
  {
    icon: <FaLock className="text-red-600 text-4xl" />,
    title: 'Robust Security Protocols',
    description: 'Every codebase and payment is secured using industry-standard encryption.',
  },
  {
    icon: <FaHeadset className="text-red-600 text-4xl" />,
    title: 'Reliable Technical Support',
    description: 'Our expert support team is available 24/7 to keep your web solutions running smoothly.',
  },
  {
    icon: <FaUserCheck className="text-red-600 text-4xl" />,
    title: 'Vetted Web Developers',
    description: 'Collaborate with certified professionals experienced in building scalable applications.',
  },
];

const FeatureSection = () => (
  <section className="py-14 px-6 lg:px-20 mx-auto max-w-7xl">
    {/* Section Header */}
    <div className="text-center mb-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
        Our Core Features
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        The essential tools and professional support your software company needs to deliver world-class web development services.
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          className="w-full bg-white shadow-sm rounded-2xl p-8 hover:shadow-xl transition duration-300 flex flex-col justify-between h-full"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
              {feature.title}
            </h3>
            <p className="text-base text-gray-600 text-center">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureSection;
