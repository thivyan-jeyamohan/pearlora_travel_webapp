import React from 'react';
import Head from './Head';
import TourCardSlider from './TourCardSlider/TourCardSlider';
import DesList from './retrive/desList';
import MyComponent from "./MyComponent"; // ✅ Use MyComponent instead of SearchBar

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
        <TourCardSlider />
      </div>

      <div>
        <DesList />
      </div>
    </div>
  );
}

export default Destination;
