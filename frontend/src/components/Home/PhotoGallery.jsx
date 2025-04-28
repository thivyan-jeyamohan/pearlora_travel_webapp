import React, { useState } from "react";

const images = [
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
];

const PhotoGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const progress = ((currentIndex + 1) / images.length) * 100;

  return (
    <div className="w-[90%] mx-auto relative">
      {/* Image Display */}
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`Gallery ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Gallery Info & Controls */}
      <div className="bg-gray-900 text-white p-5 rounded-lg w-[55%] mx-auto absolute -bottom-20 left-0 right-0">
        <h2 className="text-xl font-bold">Famous Photo Gallery</h2>
        <p className="text-sm text-gray-300">Click Photo To Large</p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-600 rounded mt-3">
          <div className="h-full bg-purple-500 rounded" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Counter */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </span>

          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              className="bg-white text-gray-800 px-6 py-2 rounded-full shadow-md hover:bg-purple-600 hover:text-white transition"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="bg-white text-gray-800 px-6 py-2 rounded-full shadow-md hover:bg-purple-600 hover:text-white transition"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
