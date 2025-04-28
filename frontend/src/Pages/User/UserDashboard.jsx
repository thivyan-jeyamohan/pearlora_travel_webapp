import { useState } from "react";
import { FaSearch, FaRocket } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { IoBookmarks } from "react-icons/io5";
import { MdGpsFixed } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { MdFlightTakeoff } from "react-icons/md";
import { RiHotelFill } from "react-icons/ri";
import { RiCalendarEventLine } from "react-icons/ri";
import { GrMoney } from "react-icons/gr";




import profile from "../../assets/profileimg.png"

import UserTransport from "./UserTransport";
import UserDestination from"./UserDestination";
import UserEvent from "./UserEvent";
import UserFinancial from "./UserFinancial";
import UserHotel from "./UserHotel";
import Dashboard from "./UserMainDas";


export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    

    const handleClick = (tab) => {
        setActiveTab(tab)
    }


  return (
    <div className="flex  bg-white mt-20 font-inter font-medium h-fit ">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white shadow-lg p-6 flex flex-col fixed">
        <div className="flex flex-col items-center space-x-3 mb-5 mt-7 ml-6">
          <img src={profile} className="w-20" />
          <h1 className="text-1xl font-bold">Riaz Tonys</h1>
          <h1 className="text-1xl">abc@example.com</h1>
        </div>
        <nav className="space-y-5 ml-6 font-bold">
          
            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "Dashboard" ? "text-amber-700" : "text-gray-500"}`}
                    onClick={() => handleClick("Dashboard")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "Dashboard" ? "bg-amber-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <MdSpaceDashboard className="text-xl" />
                </div>
                <span className="transition-all duration-300">Dashboard</span>
            </div>

            <hr className="border-t border-gray-300 " />


            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "UserDestination" ? "text-amber-700" : "text-gray-500"}`}
                    onClick={() => handleClick("UserDestination")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "UserDestination" ? "bg-amber-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <MdPlace className="text-xl" />
                </div>
                <span className="transition-all duration-300">Destination</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "UserTransport" ? "text-amber-700" : "text-gray-500"}`}
                    onClick={() => handleClick("UserTransport")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "UserTransport" ? "bg-amber-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <MdFlightTakeoff className="text-xl" />
                </div>
                <span className="transition-all duration-300">Transport</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "UserHotel" ? "text-amber-700" : "text-gray-500"}`}
                    onClick={() => handleClick("UserHotel")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "UserHotel" ? "bg-amber-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <RiHotelFill  className="text-xl" />
                </div>
                <span className="transition-all duration-300">Hotel</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "UserEvent" ? "text-amber-700" : "text-gray-500"}`}
                    onClick={() => handleClick("UserEvent")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "UserEvent" ? "bg-amber-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <RiCalendarEventLine   className="text-xl" />
                </div>
                <span className="transition-all duration-300">Event</span>
            </div>

            <hr className="border-t border-gray-300 " />

            <div className={`flex items-center space-x-3 cursor-pointer ${activeTab === "UserFinancial" ? "text-amber-700" : "text-gray-500"}`}
                    onClick={() => handleClick("UserFinancial")}>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === "UserFinancial" ? "bg-amber-700 text-white" : "bg-transparent text-gray-500"}`}>
                    <GrMoney   className="text-xl" />
                </div>
                <span className="transition-all duration-300">Financial</span>
            </div>

            <hr className="border-t border-gray-300 " />

        </nav>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-7 ml-64 bg-white w-fit h-fit">
        
      {
          activeTab === "Dashboard" && (
            <div className=" p-6 rounded-lg shadow-lg">
            <Dashboard/>
        </div>
          )
        }

        {/* Flight Booking Widget */}
        {
          activeTab === "UserDestination" && (
            <div className=" p-6 rounded-lg shadow-lg">
            <UserDestination />
        </div>
          )
        }

        {
          activeTab === "UserTransport" && (
            <div className=" p-6 rounded-lg shadow-lg">
            <UserTransport />
        </div>
          )
        }

        {
          activeTab === "UserHotel" && (
            <div className=" p-6 rounded-lg shadow-lg">
            <UserHotel/>
        </div>
          )
        }

        {
          activeTab === "UserEvent" && (
            <div className=" p-6 rounded-lg shadow-lg">
            <UserEvent/>
        </div>
          )
        }

        {
          activeTab === "UserFinancial" && (
            <div className=" p-6 rounded-lg shadow-lg">
            <UserFinancial/>
        </div>
          )
        }
        
      </div>
    </div>
  );
}
