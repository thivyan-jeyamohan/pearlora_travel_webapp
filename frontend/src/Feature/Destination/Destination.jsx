import React from 'react';
import Head from './Head';
import TourCardSlider from './TourCardSlider/TourCardSlider';
import DesList from './retrive/desList';
import MyComponent from "./MyComponent"; // ✅ Use MyComponent instead of SearchBar
import WeatherBox from './WeatherBox';
import Footer  from "../../components/Footer"


function Destination() {
  return (
    <div>
      <div>  
        <Head />
      </div>

      {/* ✅ Use MyComponent, which correctly passes onResults */}
      <div>
        <MyComponent />  
      </div>

     

      

      <div>
        <WeatherBox/>
      </div>

      <div className='mt-15'></div>
      <Footer />
    </div>
  );
}

export default Destination;
