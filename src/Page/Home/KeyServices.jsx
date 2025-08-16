import React, { useState, useContext } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FaChartLine, FaHeadset, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../Theme/ThemeProvider';

const services = [
  {
    img: "https://i.ibb.co/Sz0d9Zf/website-6721800.png",
    keyword: 'Sales Optimization',
    icon: <FaChartLine size={28} className="text-red-500" />,
    shortDesc: 'Maximize your revenue through proven sales techniques.',
    fullText: [
      'Our Sales Optimization service provides end-to-end analysis of your sales funnel, identifies gaps, and implements strategies to improve lead conversion.',
      'Personalized lead management strategies.',
      'Data-driven marketing campaigns.',
      'Conversion optimization using A/B testing.',
      'CRM integration and reporting.',
      'Continuous performance monitoring and improvement.',
      'Our approach ensures increased sales efficiency, higher customer engagement, and measurable revenue growth.'
    ],
  },
  {
    img: "https://i.ibb.co/MxGNnBcw/ai-generated-9753233-1920.jpg",
    keyword: 'Customer Support',
    icon: <FaHeadset size={28} className="text-red-500" />,
    shortDesc: 'Reliable support ensuring customer satisfaction.',
    fullText: [
      'Customer Support is vital for business retention. Our service includes:',
      'Multi-channel support (chat, email, call centers).',
      '24/7 monitoring and response.',
      'Trained professionals ensuring quick resolution.',
      'Customer feedback collection and analysis.',
      'Strategies to reduce response time and increase satisfaction.',
      'We help businesses retain customers, improve loyalty, and maintain smooth operations.'
    ],
  },
  {
    img: "https://i.ibb.co/9kWhQyXc/lamp-1315735-1920.jpg",
    keyword: 'Business Consulting',
    icon: <FaLightbulb size={28} className="text-red-500" />,
    shortDesc: 'Expert advice to grow your business strategically.',
    fullText: [
      'Business Consulting involves analyzing market trends, internal processes, and competitor strategies. Our full consulting package provides:',
      'Strategic business planning.',
      'Market and competitor analysis.',
      'Process optimization and automation.',
      'Financial forecasting and budgeting.',
      'Growth strategy recommendations.',
      'We help you make informed decisions, scale efficiently, and ensure long-term business success.'
    ],
  },
];

const ServicesSection = () => {
  const [modalService, setModalService] = useState(null);
  const { theme } = useContext(ThemeContext);

  // Theme-based classes
  const sectionBg = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-950 text-gray-200 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
  const modalBg = theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-white text-gray-900';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';

  return (
    <section className={`${sectionBg} py-16 px-6 lg:px-14 mx-auto max-w-7xl`}>
      {/* Section Header */}
      {/* Section Header */}
<div className="text-center mb-12 relative">
  {/* Small Icon above title */}
  <FaLightbulb className="text-red-500 w-10 h-10 mx-auto mb-3" />

  <h2 className={`text-4xl font-extrabold mb-4 flex justify-center items-center gap-3 ${textColor}`}>
    {/* Icon inside title */}
    <FaChartLine className="text-red-500 w-8 h-8" />
    Explore Our Key Services
  </h2>

  <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
    Tailored solutions designed to help your business thrive in a competitive market.
  </p>
</div>


      {/* Services Grid */}
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className={`${cardBg} rounded-2xl border shadow-lg flex flex-col h-full cursor-pointer`}
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 25px rgba(239, 68, 68, 0.4)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <img
              src={service.img}
              alt={service.keyword}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
            <div className="p-8 flex flex-col flex-1 text-center">
              <motion.div
                className="flex flex-col items-center gap-2 mb-4 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
                <h3 className={`text-2xl font-bold relative inline-block ${textColor}`}>
                  {service.keyword}
                  <motion.span
                    className="absolute left-0 -bottom-1 h-0.5 bg-red-500 w-0"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </h3>
              </motion.div>

              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                {service.shortDesc}
              </p>

              <motion.button
                onClick={() => setModalService(service)}
                className="mt-auto inline-flex items-center justify-center font-medium text-red-500 hover:text-red-700 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Learn More <FiArrowRight className="ml-2 text-xl" />
                <motion.span
                  className="absolute left-0 -bottom-0.5 h-0.5 bg-red-500 w-0"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {modalService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            className={`${modalBg} rounded-2xl w-full max-w-3xl p-8 relative overflow-y-auto max-h-[90vh] shadow-2xl`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={() => setModalService(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-5xl"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-4">
              {modalService.icon}
              <h3 className="text-3xl font-bold">{modalService.keyword}</h3>
              <ul className="text-lg mt-2 space-y-2">
                {modalService.fullText.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="mt-1 text-red-500 flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
