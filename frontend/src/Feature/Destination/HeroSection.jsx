import React from "react";
import HomeImage from './image/Home.png';

export default function HeroSection() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${HomeImage})`,
        backgroundSize: "contain", // Keep full image visible
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "calc(100vw - 70px)", // Reduce width by 50px (25px per side)
        height: "calc(100vh - 80px)", // Reduce height by 50px (25px per side)
        margin: "35px", // Ensures equal spacing from all sides
      }}// Apply background image
    >
       {/* Content */}
       <div className="relative text-center text-white px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Millions Of Experiences. <br /> One Simple Search.
        </h1>
        <p className="text-lg mt-3">
          Find what makes you happy anytime, anywhere.
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex items-center bg-white rounded-full px-4 py-2 w-full max-w-2xl shadow-lg">
          {/* Location Input */}
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-gray-500 text-xl">📍</span>
            <input
              type="text"
              placeholder="Where To?"
              className="outline-none text-gray-700 w-full placeholder-gray-500"
            />
          </div>
          {/* Date Picker */}
             <div className="flex items-center space-x-2 ml-4">
             <span className="text-gray-500 text-xl">📅</span>
             <input
            type="date"
            className="outline-none text-gray-700 bg-transparent"
    />
          </div>
        </div>
      </div>
      
    </div>
  );
}
