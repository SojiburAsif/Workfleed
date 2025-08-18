import React, { useContext } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Lottie from 'lottie-react';
import 'swiper/css';
import 'swiper/css/pagination';
import animationData1 from '../../../src/assets/lottii3/Red Graph.json';
import animationData2 from '../../../src/assets/lottii3/developer red.json';
import animationData3 from '../../../src/assets/lottii3/Business team.json';
import { Link } from 'react-router';
import { ThemeContext } from '../../Theme/ThemeProvider';

const slides = [
  {
    title: 'Empower Your Team with',
    keywords: ['Employee Management', 'Task Tracking', 'Role Assignment'],
    description:
      'Easily manage your workforce with WorkFleet’s real-time dashboard, automated workflows, and secure access control.',
    animation: animationData1,
  },
  {
    title: 'Organize Tasks Smartly through',
    keywords: ['Deadline Tracking', 'Task Prioritization', 'Smart Notifications'],
    description:
      'Track tasks from start to finish, prioritize workloads, and keep everyone on the same page with smart reminders.',
    animation: animationData2,
  },
  {
    title: 'Simplify HR Workflows using',
    keywords: ['Performance Metrics', 'Payroll Management', 'Employee Insights'],
    description:
      'Let WorkFleet handle routine HR tasks while you focus on growing your business with actionable data insights.',
    animation: animationData3,
  },
];

const Banner = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = String(theme).toLowerCase() === 'dark';

  // classes that depend on theme
  const containerOverlayClass = isDark ? 'bg-black/60' : 'bg-white';
  const textColorClass = isDark ? 'text-white' : 'text-black';
  const descColorClass = isDark ? 'text-white/80' : 'text-black/80';
  const typewriterRedClass = isDark ? 'text-red-300' : 'text-red-700';
  const workfleetRedClass = isDark ? 'text-red-400' : 'text-red-600';
  const buttonBgClass = 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900';

  return (
    <div id="home" className="w-full">
      <div className="max-w-full mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-[95vh]"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              {/* ---------- DESKTOP: keep exact/unchanged layout (visible on lg and up) ---------- */}
              <div
                className={`hidden lg:flex w-full h-full flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 text-left relative overflow-hidden`}
                style={{
                  backgroundBlendMode: 'overlay',
                  backgroundImage: `url(${slide.image || ''})`,
                }}
              >
                {/* Gradient overlay (red-50 -> red-100 -> red-200) */}
                <div
                  className="absolute inset-0 pointer-events-none  opacity-60"
                  aria-hidden
                />
                {/* Theme overlay */}
                <div className={`absolute inset-0 pointer-events-none ${containerOverlayClass} `} aria-hidden />

                {/* Content (on top) */}
                <div className="relative z-30 max-w-full lg:max-w-3xl space-y-6">
                  <div className="relative">
                    <h1 className={`${textColorClass} min-h-40 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug`}>
                      {slide.title}{' '}
                      <span className={typewriterRedClass}>
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
                    </h1>

                    {/* Fixed নিচে টেক্সট (desktop) */}
                    <div className={`absolute left-0 ${workfleetRedClass} font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}>
                      WorkFleet
                    </div>
                  </div>

                  <p className={`${descColorClass} text-sm md:mt-14 sm:text-base md:text-lg lg:text-xl`}>
                    {slide.description}
                  </p>

                  <button className={`${buttonBgClass} text-white font-semibold px-6 py-3 rounded-lg transition duration-300 text-sm sm:text-base`}>
                    <Link to="dashboard">Get Started</Link>
                  </button>
                </div>

                {/* Right Side - Lottie Animation (desktop) */}
                <div className="relative z-30 w-full lg:w-[500px] h-[400px] mt-10 lg:mt-0">
                  <Lottie animationData={slide.animation} loop={true} />
                </div>
              </div>

              {/* ---------- MOBILE / TABLET: different responsive layout (visible below lg) ---------- */}
              <div
                className={`flex lg:hidden w-full h-full flex-col items-start justify-start px-4 sm:px-6 md:px-8 text-left pt-8 pb-8 relative overflow-hidden`}
                style={{
                  backgroundBlendMode: 'overlay',
                  backgroundImage: `url(${slide.image || ''})`,
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none  opacity-60" aria-hidden />
                {/* Theme overlay */}
                <div className={`absolute inset-0 pointer-events-none ${containerOverlayClass}`} aria-hidden />

                {/* Content */}
                <div className="relative z-30 w-full">
                  <h1 className={`${textColorClass} font-bold text-xl sm:text-2xl md:text-3xl leading-tight`}>
                    {slide.title}{' '}
                    <span className={`${typewriterRedClass} block`}>
                      <Typewriter
                        words={slide.keywords}
                        loop
                        cursor
                        cursorStyle="|"
                        typeSpeed={60}
                        deleteSpeed={40}
                        delaySpeed={900}
                      />
                    </span>
                  </h1>

                  {/* WorkFleet fixed under typewriter (mobile) */}
                  <div className={`${workfleetRedClass} mt-2 font-semibold text-xl sm:text-2xl md:text-3xl`}>
                    WorkFleet
                  </div>

                  {/* Description */}
                  <p className={`${descColorClass} text-sm sm:text-base md:text-lg mt-4`}>
                    {slide.description}
                  </p>

                  {/* Lottie below text (smaller on mobile) */}
                  <div className="w-full h-[220px] sm:h-[260px] md:h-[320px] mt-4 flex items-center justify-center">
                    <Lottie animationData={slide.animation} loop={true} />
                  </div>

                  {/* Button full width on mobile */}
                  <div className="w-full mt-4">
                    <Link
                      to="dashboard"
                      className={`w-full block text-center ${buttonBgClass} text-white font-semibold px-6 py-3 rounded-lg transition duration-300 text-base`}
                    >
                      Get Started
                    </Link>
                  </div>
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
