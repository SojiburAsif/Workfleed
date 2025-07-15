import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import salesImg from '../../assets/section-pic/austin-distel-wD1LRb9OeEo-unsplash.jpg';
import supportImg from '../../assets/section-pic/austin-distel-wD1LRb9OeEo-unsplash.jpg';
import consultingImg from '../../assets/section-pic/austin-distel-wD1LRb9OeEo-unsplash.jpg';

const services = [
  {
    img: salesImg,
    keyword: 'Sales Optimization',
    description: 'Maximize your revenue through proven sales techniques that are designed to increase conversion rates and customer engagement.',
  },
  {
    img: supportImg,
    keyword: 'Customer Support',
    description: 'Reliable support ensuring your customers are always satisfied. Our 24/7 support solutions keep your operations running smoothly.',
  },
  {
    img: consultingImg,
    keyword: 'Business Consulting',
    description: 'Expert advice to grow your business strategically with data-driven decisions and market insights.',
  },
];

const ServicesSection = () => {
  return (
    <section className="bg-white py-16 px-6 lg:px-20 mx-auto max-w-7xl">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Explore Our Key Services
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tailored solutions designed to help your business thrive in a competitive market. Whether you're aiming to scale your operations, enhance customer engagement, or seek expert guidance — we've got you covered.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className="w-full bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full"
            initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          >
            <img
              src={service.img}
              alt={service.keyword}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
            <div className="p-8 flex flex-col flex-1 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {service.keyword}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                {service.description}
              </p>
              <button className="mt-auto inline-flex items-center justify-center font-medium text-red-500 hover:text-red-700">
                Learn More <FiArrowRight className="ml-2 text-xl" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;