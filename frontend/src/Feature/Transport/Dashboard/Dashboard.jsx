import { useState } from "react";
import { FaSearch, FaRocket } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { IoBookmarks } from "react-icons/io5";
import { MdGpsFixed } from "react-icons/md";
import { BiSolidHelpCircle } from "react-icons/bi";
import FlightTravels from "./FlightTravels";

export default function TransportDashboard() {
    const [activeTab, setActiveTab] = useState(null);

    const handleClick = (tab) => {
        setActiveTab(tab)
    }


  return (
    <div className="flex h-screen bg-gray-100 mt-20 font-inter font-medium ">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-10 mt-7 ml-6">
          
          <h1 className="text-1xl font-bold">TRANSPORT ADMIN</h1>
        </div>
        <nav className="space-y-5 ml-6 font-bold">
          
            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "Dashboard" ? "text-violet-700" : "text-gray-500"}`}
                    onClick={() => handleClick("Dashboard")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "Dashboard" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <MdSpaceDashboard className="text-xl" />
                </div>
                <span className="transition-all duration-300">Dashboard</span>
            </div>

            <hr className="border-t border-gray-300 " />


            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "flightTravel" ? "text-violet-700" : "text-gray-500"}`}
                    onClick={() => handleClick("flightTravel")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "flightTravel" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <RiFlightTakeoffFill className="text-xl" />
                </div>
                <span className="transition-all duration-300">Flight Travels</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "FlightBooking" ? "text-violet-700" : "text-gray-500"}`}
                    onClick={() => handleClick("FlightBooking")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "FlightBooking" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <IoBookmarks className="text-xl" />
                </div>
                <span className="transition-all duration-300">Flight Booking</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "FlightGPS" ? "text-violet-700" : "text-gray-500"}`}
                    onClick={() => handleClick("FlightGPS")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "FlightGPS" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <MdGpsFixed className="text-xl" />
                </div>
                <span className="transition-all duration-300">Flight GPS</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "Help" ? "text-violet-700" : "text-gray-500"}`}
                    onClick={() => handleClick("Help")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "Help" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <BiSolidHelpCircle className="text-xl" />
                </div>
                <span className="transition-all duration-300">Help</span>
            </div>

            <hr className="border-t border-gray-300 " />

        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        

        {/* Flight Booking Widget */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <FlightTravels />
        </div>
      </div>
    </div>
  );
}
