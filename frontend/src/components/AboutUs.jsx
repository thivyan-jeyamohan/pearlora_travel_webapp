import React from 'react';
import about1 from "../assets/about1.png";
import about4 from "../assets/about4.jpg";
import Footer from "../components/Footer";

const AboutUsSection = () => {
  return (
    <div className="w-full mx-auto">
      {/* First Section: About Us with Background Image */}
      <div className="p-20 w-full ">
        <img src={about4} className='w-full h-130 rounded-4xl mt-10 ' />
          
       
      </div>

      {/* Second Section: Provide The Best Travel Experience */}
      <div className="p-20">
        <h2 className="text-5xl font-bold text-center mb-4">
          Provide The Best Travel Experience For You
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          We understand that every journey has unique needs. Therefore, we offer customized travel packages designed according to your preferences and budget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Our Vision Card */}
          <div className="bg-teal-50 p-6 rounded-2xl flex items-start space-x-4">
            <svg
              className="w-12 h-12 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              <path d="M12 8v8m-4-4h8" />
            </svg>
            <div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                Our vision is to become a leading travel agency company that provides high-quality services and inspiration for our customer.
              </p>
            </div>
          </div>

          {/* Our Mission Card */}
          <div className="bg-teal-50 p-6 rounded-2xl flex items-start space-x-4">
            <svg
              className="w-12 h-12 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zM12 2v20M2 7l10 5 10-5M2 17l10 5 10-5" />
            </svg>
            <div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                Our mission is to deliver exceptional travel experiences that inspire and delight our customers, tailored to their unique needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Third Section: Finding Your Dream Destination */}
      <div className="bg-teal-600 text-white p-15 m-20 rounded-4xl">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Side: Heading and Subheading */}
          <div className="md:w-1/2">
            <h2 className="text-5xl font-bold mb-4">
              Finding Your Dream Destination Is Our Priority
            </h2>
            <p className="text-lg">
              With a collection of destinations that include stunning natural landscapes, vibrant cosmopolitan cities and enchanting tropical islands, we take you to the world's most stunning places.
            </p>
          </div>

          {/* Right Side: Cards */}
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Lots of Choices Card */}
            <div className="bg-white text-black p-6 rounded-2xl flex flex-col items-start space-y-4">
              <svg
                className="w-10 h-10 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM3 9h18M9 21V9" />
              </svg>
              <h3 className="text-xl font-semibold">Lots of Choices</h3>
              <p className="text-gray-600">
                Thousands of the best destinations are ready to spoil your eyes.
              </p>
            </div>

            {/* Accommodation Card */}
            <div className="bg-white text-black p-6 rounded-2xl flex flex-col items-start space-y-4">
              <svg
                className="w-10 h-10 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7H6l6 6 6-6h-3V5a3 3 0 0 0-3-3zM6 22h12" />
              </svg>
              <h3 className="text-xl font-semibold">Accommodation</h3>
              <p className="text-gray-600">
                There are many choices of interesting destinations to make stories on your trip.
              </p>
            </div>

            {/* Easy Booking Card */}
            <div className="bg-white text-black p-6 rounded-2xl flex flex-col items-start space-y-4">
              <svg
                className="w-10 h-10 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM16 3v4M8 3v4M3 9h18M9 14h6m-3-3v6" />
              </svg>
              <h3 className="text-xl font-semibold">Easy Booking</h3>
              <p className="text-gray-600">
                No need to be complicated in ordering tickets, order now with a few taps.
              </p>
            </div>

            {/* Best Tour Guide Card */}
            <div className="bg-white text-black p-6 rounded-2xl flex flex-col items-start space-y-4">
              <svg
                className="w-10 h-10 text-pink-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
              <h3 className="text-xl font-semibold">Best Tour Guide</h3>
              <p className="text-gray-600">
                Don't worry about traveling anywhere, our tour guide is ready to guide you anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Section: Enjoy Exclusive Personalized Service */}
      <div className="p-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left Side: Image */}
          <div className="md:w-1/2">
            <img
              src={about1}
              alt="Family with luggage at airport"
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>

          {/* Right Side: Heading and Subheading */}
          <div className="md:w-1/2">
            <h2 className="text-5xl font-bold mb-4">
              Enjoy Exclusive Personalized Service And An Unforgettable Experience
            </h2>
            <p className="text-lg text-gray-600">
              We are a team of professionals with a deep passion for travel. We believe that travel is a window to adventure, cultural discovery and personal growth.
            </p>
          </div>
        </div>
      </div>

      <Footer />


    </div>
  );
};

export default AboutUsSection;