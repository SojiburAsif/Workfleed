import React from 'react';
import Banner from './Banner';
import FeatureSection from './Features';
import SupportCard from './KeyServices';
import HowItWorks from './HowItWorks';
import Feature from './RelaventSecton';
import ReviewSection from './ReviewSection';


const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <FeatureSection></FeatureSection>
      <SupportCard></SupportCard>
      <ReviewSection></ReviewSection>
      <HowItWorks></HowItWorks>
      <Feature></Feature>
    </div>
  );
};

export default Home;