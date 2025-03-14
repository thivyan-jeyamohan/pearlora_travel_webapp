import React, { useState } from 'react';
import PhotoGallery from '../components/Home/PhotoGallery';
import TourPackages from '../components/Home/TourPackages';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import Footer from '../components/Footer';
import Intro from '../components/Home/Intro';
import Header from '../components/header';
import ActivityBar from '../components/Home/ActivityBar';
import DestinationBox from '../components/Home/DestinationBox';
import TravelExperience from '../components/Home/TravelExperience';
import TxtContent from '../components/Home/TxtContent';

function Home() {
    const imageList = [
        '../assets/ins1.webp',
        '../assets/ins2.webp',
        '../assets/ins3.webp',
        '../assets/ins4.webp',
      ];

    
  return (
    <>
    
    <div className='mt-20'></div>
    <Intro />
    <ActivityBar />
    <DestinationBox />
    <TravelExperience />
    <TxtContent />
    <div className='mt-6'></div>
    <PhotoGallery  />
    <div className='mt-6'></div>
    <TourPackages />
    <div className='mt-15'></div>
    <TestimonialsSection />
    <div className='mt-15'></div>
    <Footer />


    </>
  );
}

export default Home;