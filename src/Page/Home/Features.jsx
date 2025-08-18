import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarCheck,
  FaLock,
  FaHeadset,
  FaUserCheck,
  FaUsers,
  FaClock,
  FaFileInvoiceDollar,
  FaCogs,
  FaTimes,
  FaCheckCircle,
  FaStar,
} from 'react-icons/fa';
import { ThemeContext } from '../../Theme/ThemeProvider';

const FEATURES = [
  {
    id: 'scheduling',
    icon: <FaCalendarCheck className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Effortless Project Scheduling',
    short: 'Plan and initiate projects with ease and accuracy.',
    details: [
      'Visual timeline and calendar view for all projects.',
      'Auto-assign team members based on availability.',
      'Recurring tasks and reminders.',
    ],
  },
  {
    id: 'security',
    icon: <FaLock className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Robust Security Protocols',
    short: 'Industry-standard encryption for codebase and payments.',
    details: [
      'Encrypted data at rest and in transit (TLS + AES).',
      'Role-based access control and audit logs.',
      'Two-factor authentication support for admin users.',
    ],
  },
  {
    id: 'support',
    icon: <FaHeadset className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Reliable Technical Support',
    short: 'Expert support team available 24/7.',
    details: [
      'Multi-channel support: chat, email, phone.',
      'SLA-backed responses for paid plans.',
      'Dedicated account managers for enterprise customers.',
    ],
  },
  {
    id: 'vetted',
    icon: <FaUserCheck className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Vetted Web Developers',
    short: 'Work with certified professionals for scalable builds.',
    details: [
      'Profiles with verified experience and ratings.',
      'Portfolio and interview summaries visible in the dashboard.',
      'Option to request a trial engagement before full hire.',
    ],
  },
  {
    id: 'collaboration',
    icon: <FaUsers className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Collaboration Tools',
    short: 'Built-in chat, file sharing, and comments.',
    details: [
      'Task comments with file attachments.',
      'Shared documents and version history.',
      'Activity feed for full team visibility.',
    ],
  },
  {
    id: 'time-tracking',
    icon: <FaClock className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Time & Attendance',
    short: 'Accurate time-tracking and attendance logs.',
    details: [
      'Clock-in / clock-out with geo-fencing options.',
      'Overtime calculation and exportable timesheets.',
      'Mobile app friendly for on-the-go teams.',
    ],
  },
  {
    id: 'payroll',
    icon: <FaFileInvoiceDollar className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'Payroll Integration',
    short: 'Seamless payroll-ready reports and exports.',
    details: [
      'Auto-generate payroll based on attendance & approvals.',
      'Export to common payroll formats (CSV, XLSX).',
      'Tax and deduction configuration per jurisdiction.',
    ],
  },
  {
    id: 'api-integrations',
    icon: <FaCogs className="text-red-600 dark:text-red-400 text-4xl" />,
    title: 'API & Integrations',
    short: 'Connect with your favorite tools and platforms.',
    details: [
      'Public REST API for data sync and automation.',
      'Native integrations: Slack, Google Workspace, QuickBooks.',
      'Webhooks for real-time notifications and workflows.',
    ],
  },
];

const FeatureSection = () => {
  const { theme } = useContext(ThemeContext);
  const [activeFeature, setActiveFeature] = useState(null);

  const wrapperBg = theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900';
  const cardBase = theme === 'dark'
    ? 'bg-gray-950 border border-gray-800 text-gray-100'
    : 'bg-white border border-gray-200 text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const modalBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900';

  return (
    <section className={`${wrapperBg} py-14 px-4 sm:px-6 lg:px-10`}>
      <div className="max-w-7xl mx-auto text-center mb-12">
        <FaStar className="text-red-600 dark:text-red-400 w-10 h-10 mx-auto mb-4" />
        <h2 className={`text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-3 mb-3`}>
          <FaCalendarCheck className="text-red-600 dark:text-red-400 w-8 h-8" />
          Our Core Features
        </h2>
        <p className={`text-base sm:text-lg max-w-2xl mx-auto ${subText}`}>
          Essential tools and professional support your teams need to deliver outstanding results.
        </p>
      </div>

      <div className="max-w-7xl mx-auto md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.id}
            className={`${cardBase} rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full cursor-pointer shadow-sm`}
            whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(239,68,68,0.15)' }}
            onClick={() => setActiveFeature(feature)}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div>{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
              <p className={`text-sm sm:text-base ${subText}`}>{feature.short}</p>
            </div>

            <button
              className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-medium hover:underline text-sm sm:text-base"
              onClick={(e) => { e.stopPropagation(); setActiveFeature(feature); }}
            >
              Learn More
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveFeature(null)}
          >
            <motion.div
              className={`${modalBg} rounded-3xl w-full max-w-md sm:max-w-2xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]`}
              initial={{ y: -30, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button
                onClick={() => setActiveFeature(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>

              <div className="flex flex-col items-center gap-4">
                <div>{activeFeature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-center">{activeFeature.title}</h3>
                <p className={`text-sm sm:text-base ${subText} text-center max-w-xl`}>
                  {activeFeature.short}
                </p>

                <ul className="mt-4 space-y-2 text-left w-full max-w-xl px-2 sm:px-0">
                  {activeFeature.details.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheckCircle className="mt-1 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span className={subText}>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeatureSection;
