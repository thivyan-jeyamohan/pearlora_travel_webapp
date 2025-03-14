import React from 'react';
import { FaPlay, FaMapMarkerAlt } from 'react-icons/fa'; 
import homeBanner from "../../assets/home-banner-1.webp";  
import homePattern from "../../assets/home-pattern.webp";

export default function Intro (){
    return(
        <section className="relative bg-gradient-to-br from-gray-50 to-white py-24 overflow-hidden">
        {/* Image Overlay (Right Side) */}
      <div className=" top-10 left-0 h-full w-full lg:w-1/2">
        <img
          src={homePattern}  
          alt="Travel Destinations"
          className="absolute top-0 left-0 object-cover h-200 w-50 ml-1"
        />
        
      </div>


      <div className="container mx-auto px-4 relative z-10 mr-3">
        <div className="text-2xl absolute -top-10 left-5 text-gray-600 font-medium flex items-center">
          <FaMapMarkerAlt className="h-4 w-4 mr-1" />
          Get To Know Us
        </div>

        {/* Main Text */}
        <h1 className="text-5xl lg:text-8xl font-bold text-gray-800 leading-tight mb-6">
          Travel, Enjoy <br />
          And Live a New <br />
          Full Life
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-lg">
          We don't just work with concrete and steel. We work with people We are Approachable, with even our highest work work with oncrete and steel.<br/>
          We work with people
        </p>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-5 px-15 rounded-full">
            About Us
          </button>
          <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 px-15 rounded-full flex items-center gap-3">
            <FaPlay className="h-5 w-5 mr-2" />
            Book
          </button>
        </div>
      </div>

      {/* Image Overlay (Right Side) */}
      <div className="absolute top-0 right-0 h-full w-full lg:w-1/2">
        <img
          src={homeBanner}  
          alt="Travel Destinations"
          className="absolute top-0 right-0 h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-white via-transparent to-transparent opacity-30"></div> {/* Gradient overlay */}
      </div>
    </section>
    )
}


