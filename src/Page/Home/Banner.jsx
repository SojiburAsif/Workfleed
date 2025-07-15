import React from 'react';
import { motion } from 'framer-motion';
  import { Typewriter } from 'react-simple-typewriter';
import team1 from '../../assets/Banner/pexels-darlene-alderson-7970815.jpg';
import team2 from '../../assets/Banner/pexels-serpstat-177219-572056.jpg';

const Banner = () => {
  return (
    <div className="bg-base-200 pt-0 pb-16 px-4">
      <div className="max-w-[80%] mx-auto flex flex-col lg:flex-row
       items-center justify-center gap-8 lg:gap-12">

        {/* Left side: Text content */}
        <div className="flex-1  flex flex-col justify-center space-y-6 text-center lg:text-left">


          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Streamline{' '}
            <span className="text-red-600">
              <Typewriter
                words={['Employee Management', 'Task Tracking', 'Role Assignment']}
                loop={true}
                cursor
                cursorStyle={`|`}
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
            <br />
            with <span className="text-red-600">WorkFleet</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
            WorkFleet empowers teams to manage employees, tasks, and roles with real-time updates,
            secure access, and seamless automation. Simplify your HR operations and boost productivity!
          </p>
          <div className="mx-auto lg:mx-0">
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg w-max transition duration-300">
              Get Started
            </button>
          </div>
        </div>

        {/* Right side: Animated Images */}
        <div className="flex-1 flex flex-row lg:flex-col justify-center items-center gap-6 lg:gap-8">
          {/* Image 1 */}
          <motion.div
            animate={{ y: [100, 150, 100] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 shadow-2xl"
            style={{
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              boxShadow: '0 12px 25px rgba(239, 68, 68, 0.7)',
            }}
          >
            <img
              src={team1}
              alt="Team collaboration"
              className="w-full max-w-xs sm:max-w-md lg:max-w-[22rem] object-cover rounded-full border-4 border-red-500"
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#b91c1c')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ef4444')}
            />
          </motion.div>

          {/* Image 2 */}
          <motion.div
            animate={{ x: [100, 150, 100] }}
            transition={{ duration: 10, delay: 5, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 shadow-2xl"
            style={{
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              boxShadow: '0 12px 25px rgba(239, 68, 68, 0.7)',
            }}
          >
            <img
              src={team2}
              alt="Employee management dashboard"
              className="w-full max-w-xs sm:max-w-md lg:max-w-[22rem] object-cover rounded-full border-4 border-red-500"
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#b91c1c')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ef4444')}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
