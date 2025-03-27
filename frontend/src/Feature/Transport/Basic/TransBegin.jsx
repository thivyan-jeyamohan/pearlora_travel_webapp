import React from 'react';
import travelerImage from '../../../assets/TransportBanner.png';
import { Link } from 'react-router-dom';


function TransBegin() {
  return (
    <>

 
    <div className="relative w-full h-110 bg-cover bg-center flex items-center justify-center mt-20 "
          style={{ backgroundImage: `url(${travelerImage})` }} >
      
          
       

        


        
      
    </div>

    <div className='bg-blue-50 pt-20'>
      <h1 className="text-4xl font-bold text-center">Book Your Ride – Fast, Easy & Reliable</h1>
      <p className="text-lg text-center">Choose your vehicle, select your dates, and start your journey hassle-free.</p>
      <div className="flex justify-center gap-20 mt-7">
        <button
          className="bg-gradient-to-r from-purple-950 to-purple-800 text-white font-bold text-lg px-10 py-3 rounded-4xl"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Basic Ride
        </button>
        <Link to="/express-ride">
          <button
            className="bg-gradient-to-r from-purple-950 to-purple-800 text-white font-bold text-lg px-10 py-3 rounded-4xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Express Ride
          </button>
        </Link>
        
      </div>

      
    </div>
    
    </>
  );
}

export default TransBegin;
