import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUserShield, FaTasks } from 'react-icons/fa';
import howItWorksImg from '../../assets/section-pic/razvan-chisu-Ua-agENjmI4-unsplash.jpg'; // Replace with your image path

const steps = [
  {
    id: 1,
    title: 'Register Account',
    description: 'HR or Employee can create an account using Email or Social login.',
    icon: <FaUserPlus className="text-red-500 text-4xl mb-4" />,
  },
  {
    id: 2,
    title: 'Assign Role',
    description: 'Admin assigns HR and Employee roles based on the user type.',
    icon: <FaUserShield className="text-red-500 text-4xl mb-4" />,
  },
  {
    id: 3,
    title: 'Manage Tasks',
    description: 'Employees manage tasks while HR monitors everything in real-time.',
    icon: <FaTasks className="text-red-500 text-4xl mb-4" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-16 bg-gradient-to-b from-white via-red-50 to-white">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">

        {/* Left: Steps */}
        <motion.div
          className="flex-1 grid grid-cols-1 gap-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-red-200 transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div>{step.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right: Illustration or Animation */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={howItWorksImg}
            alt="Employee Workflow"
            className="w-full max-w-sm h-[350px] object-cover rounded-xl mx-auto drop-shadow-lg"
          />
        </motion.div>


      </div>
    </section>
  );
};

export default HowItWorks;
