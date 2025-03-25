import React, { useState } from "react";
import { FaXTwitter, FaInstagram, FaYoutube } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineAccessTime, MdOutlineAttachMoney } from "react-icons/md";

const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const SearchBar = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Select Destination");
  const [isOpen, setIsOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [minPrice, setMinPrice] = useState(10000);
  const [maxPrice, setMaxPrice] = useState(1000000);

  return (
    <div className="flex flex-col items-center space-y-4 w-full px-4">
      {/* Social Media Links */}
      <div className="flex items-center space-x-3">
        <p className="text-gray-700 font-medium">Follow Our Socials To Stay Tuned</p>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <FaXTwitter size={18} />
          </button>
          <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <FaInstagram size={18} />
          </button>
          <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <FaYoutube size={18} />
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-lg shadow-lg flex items-center w-full max-w-5xl relative">
        {/* Destination Dropdown */}
        <div className="relative flex items-center px-6 py-4 border-r w-1/4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <IoLocationOutline className="text-gray-500 text-xl mr-2" />
          <p className="text-gray-600">{selectedDistrict}</p>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-1/4 bg-white shadow-lg rounded-lg overflow-hidden z-50">
            {districts.map((district, index) => (
              <p 
                key={index} 
                className="px-6 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setSelectedDistrict(district);
                  setIsOpen(false);
                }}
              >
                {district}
              </p>
            ))}
          </div>
        )}

        {/* Days Range Selector */}
        <div className="flex flex-col px-6 py-4 border-r w-1/4">
          <div className="flex items-center">
            <MdOutlineAccessTime className="text-gray-500 text-xl mr-2" />
            <p className="text-gray-600">{days} Days</p>
          </div>
          <input 
            type="range" 
            min="2" 
            max="30" 
            value={days} 
            onChange={(e) => setDays(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        {/* Price Range Selector */}
        <div className="flex flex-col px-6 py-4 border-r w-1/4">
          <div className="flex items-center">
            <MdOutlineAttachMoney className="text-gray-500 text-xl mr-2" />
            <p className="text-gray-600">LKR {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}</p>
          </div>
          <input 
            type="range" 
            min="10000" 
            max="1000000" 
          
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full mt-2"
          />
        
        </div>

        {/* Search Button */}
        <button className="bg-blue-600 text-white px-8 py-4 rounded-r-lg hover:bg-blue-700">
          Search Now
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
