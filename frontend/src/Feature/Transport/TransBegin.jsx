import React from 'react';
import travelerImage from '../../assets/transBanner.png';
import { Link } from 'react-router-dom';

function TransBegin() {
  return (
    <>
    
    <div className="bg-gray-30 text-gray-900 ">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center px-6 h-110 " style={{ backgroundImage: `url(${travelerImage})` }}>
          <div className="lg:w-1/2 px-6">
            <div className="bg-yellow-400 text-sm px-4 py-1 rounded-full inline-block">🌍 Explore the World</div>
            <h1 className="text-5xl font-bold mt-4">Transport Booking</h1>
            <p className="text-lg mt-2">Plan Your Perfect Trip</p>
            <p className="mt-6 text-gray-700">
              Booking your dream trip has never been easier! At Pearlora, we offer a seamless way to find and book the perfect destination, tailored to your preferences and budget.
            </p>
            <div className="flex items-center mt-6">
              <span className="text-lg font-semibold">⭐ 5.0 Stars</span>
              <span className="text-gray-600 ml-2">69k reviews</span>
            </div>
          </div>
          
        </div>

        


        
      </div>
    </div>

    <div>
      <h1 className="text-4xl font-bold text-center">Book Your Ride – Fast, Easy & Reliable</h1>
      <p className="text-lg text-center">Choose your vehicle, select your dates, and start your journey hassle-free.</p>
      <div className="flex justify-center gap-6">
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
