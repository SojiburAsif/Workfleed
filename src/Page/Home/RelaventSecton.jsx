import React, { useContext } from 'react';
import { FiUsers, FiActivity, FiCheckCircle, FiArrowUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../Theme/ThemeProvider';

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ShopSupport = () => {
  const { theme } = useContext(ThemeContext);

  const sectionBg = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-red-950 text-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-white';
  const accentColor = 'text-red-500';
  const borderColor = 'border-red-500';

  return (
    <section className={`${sectionBg} py-16 px-4 sm:px-6 lg:px-20 relative`} id="shop-support">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUpVariant}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* Left: Employee Stats */}
        <motion.div
          className="p-6 sm:p-8 rounded-xl"
          variants={fadeInUpVariant}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} flex items-center gap-2`}>
            <FiUsers className={`${accentColor} text-3xl`} /> Efficient Employee & HR Management
          </h2>

          <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-10 mt-10">
            <div className="flex items-center gap-4">
              <FiActivity className={`${accentColor} text-3xl sm:text-4xl`} />
              <div>
                <h4 className={`uppercase text-xs sm:text-sm ${textColor}`}>Productivity Boost</h4>
                <h2 className={`text-3xl sm:text-4xl font-bold ${textColor}`}>20%</h2>
                <p className={`text-xs sm:text-sm ${textColor}`}>Increase in overall team efficiency</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiCheckCircle className={`${accentColor} text-3xl sm:text-4xl`} />
              <div>
                <h4 className={`uppercase text-xs sm:text-sm ${textColor}`}>Active Employees</h4>
                <h2 className={`text-3xl sm:text-4xl font-bold ${textColor}`}>500+</h2>
                <p className={`text-xs sm:text-sm ${textColor}`}>Collaborating across all departments</p>
              </div>
            </div>
          </div>

          <p className={`mt-8 sm:mt-10 leading-relaxed text-sm sm:text-base ${textColor}`}>
            Our platform streamlines employee management, boosts team productivity, and keeps HR tasks simple and organized.
          </p>

          <p className={`mt-4 text-xs sm:text-sm ${textColor}`}>
            Trusted by businesses worldwide to optimize workforce operations and HR processes.
          </p>
        </motion.div>

        {/* Right: Features */}
        <motion.div
          variants={fadeInUpVariant}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 ${textColor} flex items-center gap-2`}>
            <FiActivity className={`${accentColor} text-3xl`} /> Smart HR & Team Tools
          </h2>

          <p className={`text-base sm:text-lg mb-8 sm:mb-10 ${textColor}`}>
            Track productivity, manage attendance, and get insightful daily reports — all in one place.
          </p>

          <div className="space-y-6">
            <motion.div
              className={`border-l-4 pl-4 ${borderColor}`}
              variants={fadeInUpVariant}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className={`text-lg sm:text-xl font-semibold ${textColor} flex items-center gap-2`}>
                <FiUsers /> Real-Time Team Activity
              </h3>
              <p className={`text-sm sm:text-base ${textColor}`}>
                Monitor employee engagement and tasks as they happen.
              </p>
            </motion.div>

            <motion.div
              className={`border-l-4 pl-4 ${borderColor}`}
              variants={fadeInUpVariant}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className={`text-lg sm:text-xl font-semibold ${textColor} flex items-center gap-2`}>
                <FiCheckCircle /> Insightful Daily Reports
              </h3>
              <p className={`text-sm sm:text-base ${textColor}`}>
                Understand team performance and contributions with clear daily summaries.
              </p>
            </motion.div>

            <motion.div
              className={`border-l-4 pl-4 ${borderColor}`}
              variants={fadeInUpVariant}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h3 className={`text-lg sm:text-xl font-semibold ${textColor} flex items-center gap-2`}>
                <FiActivity /> Automated HR Tools
              </h3>
              <p className={`text-sm sm:text-base ${textColor}`}>
                Simplify onboarding, payroll, attendance, and approvals for your HR team.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Up Arrow */}
      <a
        href="#home"
        className="absolute top-6 right-6 animate-bounce text-red-500 text-3xl cursor-pointer"
        title="Scroll to Home"
      >
        <FiArrowUp />
      </a>
    </section>
  );
};

export default ShopSupport;
