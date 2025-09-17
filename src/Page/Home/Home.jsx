import React, { useContext } from 'react';
import Banner from './Banner';
import FeatureSection from './Features';
import SupportCard from './KeyServices';
import HowItWorks from './HowItWorks';
import Feature from './RelaventSecton';
import ReviewSection from './ReviewSection';
import { ThemeContext } from '../../Theme/ThemeProvider';
import News from './News';

const Home = () => {
  const { theme } = useContext(ThemeContext);

  // theme-based classes
  const bgClass = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-gray-900';

  return (
    <div className={`${bgClass}  transition-colors duration-500`}>
    <div className=" mt-17 md:mt-0">  <Banner /></div>
      <FeatureSection />
      <SupportCard />
      <ReviewSection />
      <HowItWorks />
      {/* <News></News> */}
      <Feature />
    </div>
  );
};

export default Home;
