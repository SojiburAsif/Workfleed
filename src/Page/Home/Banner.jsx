import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import team1 from '../../assets/Banner/pexels-darlene-alderson-7970815.jpg';
import team2 from '../../assets/Banner/pexels-serpstat-177219-572056.jpg';
import team3 from '../../assets/Banner/pexels-darlene-alderson-7970815.jpg'; // Placeholder, change as needed

// Slide data
const slides = [
  {
    title: 'Empower Your Team with',
    keywords: ['Employee Management', 'Task Tracking', 'Role Assignment'],
    description:
      'Easily manage your workforce with WorkFleet’s real-time dashboard, automated workflows, and secure access control.',
    image: team1,
  },
  {
    title: 'Organize Tasks Smartly through',
    keywords: ['Deadline Tracking', 'Task Prioritization', 'Smart Notifications'],
    description:
      'Track tasks from start to finish, prioritize workloads, and keep everyone on the same page with smart reminders.',
    image: team2,
  },
  {
    title: 'Simplify HR Workflows using',
    keywords: ['Performance Metrics', 'Payroll Management', 'Employee Insights'],
    description:
      'Let WorkFleet handle routine HR tasks while you focus on growing your business with actionable data insights.',
    image: team3,
  },
];

const Banner = () => {
  return (
    <div id='home' className="w-full px-4 ">
      <div className="max-w-full mx-auto mt-3 ">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-[95vh]"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-full bg-cover bg-center flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start px-4 sm:px-8 md:px-12 lg:px-20 text-center lg:text-left"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundBlendMode: 'overlay',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                }}
              >
                <div className="max-w-full lg:max-w-3xl space-y-6">
                  <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug">
                    {slide.title}{' '}
                    <span className="text-red-500">
                      <Typewriter
                        words={slide.keywords}
                        loop
                        cursor
                        cursorStyle="|"
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={1000}
                      />
                    </span>
                    <br />
                    <span className="text-red-500">WorkFleet</span>
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl">
                    {slide.description}
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 text-sm sm:text-base">
                    Get Started
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
