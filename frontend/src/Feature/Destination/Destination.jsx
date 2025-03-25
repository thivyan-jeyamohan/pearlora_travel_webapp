import React from 'react';
//import HeroSection from "./HeroSection"; // Import HeroSection (same folder)
import FeaturesSection from './FeaturesSection';
//import Sample from './sample';
import Head from './Head';
import SearchBar from './SearchBar';
import TourCardSlider from './TourCardSlider/TourCardSlider'

function Destination() {
  return (

    
    <div>

     <diV>  {/* Head*/}
      <Head />
      </diV>

      <diV>  {/* Search bar*/}
      <SearchBar />
      </diV>
     
      <diV>  {/* TourCardSlider*/}
      <TourCardSlider />
      </diV>
     
  
  </div>

  

  );
}

export default Destination;