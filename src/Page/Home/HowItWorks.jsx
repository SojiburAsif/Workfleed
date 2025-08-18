import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaUserShield, FaTasks, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { ThemeContext } from '../../Theme/ThemeProvider';
import { HiOutlineMail } from 'react-icons/hi';

const steps = [
  {
    id: 1,
    title: 'Register Account',
    description: 'HR or Employee can create an account using Email or Social login. Secure registration ensures only authorized users gain access.',
    extra: 'You can sign up using Google or other social accounts. Password must be strong and secure. Verification emails are sent to confirm identity. HR can also resend verification emails if needed. Email verification ensures account authenticity and prevents unauthorized access.',
    icon: <FaUserPlus className="text-red-500 text-5xl mb-4" />,
  },
  {
    id: 2,
    title: 'Assign Role',
    description: 'Admin assigns HR and Employee roles based on the user type. Role management ensures proper access and responsibilities.',
    extra: 'Admin can modify roles anytime. Each role has different permissions. HR and Employee cannot access admin-only features. Role assignment ensures tasks and payroll are properly segregated. Admin can also temporarily suspend roles for security purposes.',
    icon: <FaUserShield className="text-red-500 text-5xl mb-4" />,
  },
  {
    id: 3,
    title: 'Manage Tasks',
    description: 'Employees update their tasks while HR monitors workflow and can approve salaries or reports in real-time.',
    extra: 'Tasks can be updated daily. HR can view progress reports, approve tasks, and manage payroll efficiently from the dashboard. Notifications alert HR and Employees of pending tasks or approvals. Detailed reports help in auditing and performance evaluation.',
    icon: <FaTasks className="text-red-500 text-5xl mb-4" />,
  },
  {
    id: 4,
    title: 'Generate Reports',
    description: 'HR and Admin can generate detailed reports for payroll, attendance, and task performance to make informed decisions.',
    extra: 'Reports can be exported in PDF or Excel formats. You can filter by employee, department, month, or year. Real-time insights help in performance evaluation and compliance tracking. Notifications can alert relevant stakeholders when reports are ready.',
    icon: <FaInfoCircle className="text-red-500 text-5xl mb-4" />,
  }
];

const faqs = [
  { question: 'How do I create an account?', answer: 'Click the "Sign Up" button in the top right corner, enter your details, and choose a secure password. You can also sign up using Google or other social login options.' },
  { question: 'How does the subscription model work?', answer: 'The platform offers monthly and yearly subscriptions. Subscription unlocks full HR and Employee management features including payroll, reports, and analytics.' },
  { question: 'Is there a free trial available?', answer: 'Yes, every new user can access a 7-day free trial to explore the platform features and workflow management tools.' },
  { question: 'What features are included in the HRMS?', answer: 'Features include task management, employee workflow tracking, payroll management, attendance tracking, reporting, and role-based access control.' },
  { question: 'How secure is my data?', answer: 'All data is encrypted, stored securely, and accessible only to authorized users. Role-based access ensures privacy and compliance with data protection regulations.' },
  { question: 'Can I manage multiple employees at once?', answer: 'Yes, HR and Admin can assign tasks, approve workflows, and process payroll for multiple employees simultaneously with bulk actions.' },
  { question: 'Are notifications available for pending tasks?', answer: 'Yes, the platform sends real-time notifications to HR and employees about pending approvals, deadlines, or overdue tasks.' },
  { question: 'Can I export reports?', answer: 'Yes, all reports including payroll, attendance, and workflow can be exported in PDF or Excel formats for record keeping.' },
  { question: 'Does the platform support mobile devices?', answer: 'Yes, the platform is responsive and works on all modern devices including smartphones and tablets.' },
];

const HowItWorks = () => {
  const { theme } = useContext(ThemeContext);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [modalStep, setModalStep] = useState(null);

  const sectionBg = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-gray-50 text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-800 shadow-md';
  const faqBg = theme === 'dark' ? 'bg-gray-950 border-gray-800 text-gray-100' : 'bg-white border-gray-300 text-gray-800';
  const hoverShadow = 'hover:shadow-2xl hover:shadow-red-400/40 transition-shadow duration-300';

  return (
    <motion.section
      id='how-it-works'
      className={`${sectionBg} py-16 px-5 relative`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-15 flex flex-col md:flex-row items-start gap-12">

        {/* Left: Steps */}
        <div className="flex-1 w-full grid grid-cols-1 gap-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HiOutlineMail className="text-red-500 w-8 h-8" />
            Contact Us
          </motion.h2>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`${cardBg} rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 relative cursor-pointer ${hoverShadow}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="text-center sm:text-left">{step.icon}</div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500 sm:text-base mb-3">{step.description}</p>
                <button
                  onClick={() => setModalStep(step)}
                  className="flex items-center gap-2 text-red-500 font-semibold text-sm hover:underline"
                >
                  <FaInfoCircle /> View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: FAQ */}
        <div className="flex-1 w-full max-w-lg">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <motion.div
                  key={idx}
                  tabIndex={0}
                  transition={{ duration: 0.6 }}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className={`${faqBg} border rounded-2xl p-5 cursor-pointer ${hoverShadow}`}
                >
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>{faq.question}</span>
                    <span className="text-red-500 text-xl">{isOpen ? '-' : '+'}</span>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-gray-500 text-base overflow-hidden"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal with blur */}
      <AnimatePresence>
        {modalStep && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={`${cardBg} rounded-3xl p-6 max-w-lg w-full relative`}

              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}

              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}


            >
              <button
                onClick={() => setModalStep(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                {modalStep.icon}
                <h3 className="text-2xl font-bold">{modalStep.title}</h3>
              </div>
              <p className="text-gray-500 mb-3">{modalStep.description}</p>
              <p className="text-gray-500">{modalStep.extra}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HowItWorks;
