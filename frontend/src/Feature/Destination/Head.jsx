import React from "react";
import { FaStar } from "react-icons/fa";
import HomeImage from "./image/home-banner.jpg"; // Update with actual image path
import UserImage from "./image/user.jpg"; // Update with actual user image path

const Head = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-32 max-w-6xl mx-auto gap-8">
      {/* Left Side Content */}
      <div className="md:w-1/2 space-y-6 mb-6 md:mb-0">
        {/* Location */}
        <p className="text-gray-700 flex items-center space-x-2">
          <span>📍</span>
          <span className="font-medium">Srilanka</span>
        </p>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Travel In Comfort: Luxury <br />
          <span className="text-orange-500">Travel Planning</span> For You
        </h1>

        {/* Description */}
        <p className="text-gray-600">
          Get ready to embark on the <span className="font-bold">journey of a lifetime!</span> 
          Our travel agency is dedicated to crafting unforgettable experiences 
          that will leave you with lifelong memories.
        </p>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
            Explore Our Destinations
          </button>
          <button className="bg-blue-100 text-blue-600 px-6 py-3 rounded-full shadow-lg">
            About Us
          </button>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="relative md:w-1/3 mt-8 md:mt-12">
        {/* Styled Image */}
        <div className="relative w-[350px] h-[220px] md:w-[450px] md:h-[320px] overflow-hidden rounded-lg shadow-xl">
          <img 
            src={HomeImage} 
            alt="Destination" 
            className="w-full h-full object-cover transform rotate-2 scale-110"
          />
        </div>

        {/* User Review Card */}
        <div className="absolute bottom-0 left-6 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 w-64 md:w-72">
          {/* User Image */}
          <img 
            src={UserImage} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* User Details */}
          <div className="flex-1">
            <h4 className="font-bold">Daniel Lokossou</h4>
            <p className="text-sm text-gray-500">Tourist</p>

            {/* Rating */}
            <div className="flex items-center text-yellow-500 text-sm mt-1">
              <FaStar />
              <span className="ml-1">4.9</span>
              <span className="text-gray-500 text-xs ml-1">(1.2K Reviews)</span>
            </div>
          </div>

          {/* Tag */}
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
            Amazing Tours
          </span>
        </div>
      </div>
    </div>
  );
};

export default Head;
