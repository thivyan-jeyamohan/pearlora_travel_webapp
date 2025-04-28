import { useState } from "react";
import { FaSearch, FaRocket } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { IoBookmarks } from "react-icons/io5";
import { MdGpsFixed } from "react-icons/md";
import { BiSolidHelpCircle } from "react-icons/bi";
import FlightTravels from "./FlightTravels";
import FlightBooking from "./FlightBooking";
import AirTravel from "./AirTravel";
import flightravelimg from "../../../assets/AirplaneFlightMap.png";
import { FaCarSide } from "react-icons/fa";
import BasicRideHistory from "./BasicRideHistory";
import Report from "./Report";
import { HiOutlineDocumentReport } from "react-icons/hi";
import RentVehicle from "../Dashboard/RentVehicle";
import UserFlightSeat from "./UserFlightSeat"



export default function TransportDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  console.log("TransportDashboard component rendered!");

  return (

    <div className="flex  bg-white mt-20 font-inter font-medium h-fit ">


      {/* Sidebar */}
      <div className="w-64 h-full bg-white shadow-lg p-6 flex flex-col fixed">
        <div className="flex items-center space-x-3 mb-2 mt-2 ml-6">
          <h1 className="text-1xl font-bold">TRANSPORT ADMIN</h1>
        </div>
        <nav className="space-y-4 ml-6 font-bold">
          <hr className="border-t border-gray-300 " />



          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "Dashboard" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("Dashboard")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "Dashboard" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <MdSpaceDashboard className="text-xl" />
            </div>
            <span className="transition-all duration-300">Dashboard</span>
          </div>




          <hr className="border-t border-gray-300 " />




          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "flightTravel" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("flightTravel")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "flightTravel" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <RiFlightTakeoffFill className="text-xl" />
            </div>
            <span className="transition-all duration-300">Flight Travels</span>
          </div>




          <hr className="border-t border-gray-300 " />



          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "FlightBooking" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("FlightBooking")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "FlightBooking" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <IoBookmarks className="text-xl" />
            </div>
            <span className="transition-all duration-300">Flight Booking</span>
          </div>

          <hr className="border-t border-gray-300 " />


          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "UserFlightSeat" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("UserFlightSeat")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "UserFlightSeat" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <IoBookmarks className="text-xl" />
            </div>
            <span className="transition-all duration-300">User Flight Seat</span>
          </div>

          <hr className="border-t border-gray-300 " />




          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "rentvehicle" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("rentvehicle")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "rentvehicle" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <FaCarSide className="text-xl" />
            </div>
            <span className="transition-all duration-300">Vehicles</span>
          </div>



          <hr className="border-t border-gray-300 " />



             
         


        



          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "Help" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("Help")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "Help" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <FaCarSide className="text-xl" />
            </div>
            <span className="transition-all duration-300">Rent Ride</span>
          </div>



          <hr className="border-t border-gray-300 " />



          <div
            className={`flex items-center space-x-3 cursor-pointer 
              ${activeTab === "Report" ? "text-violet-700" : "text-gray-500"}`}
              onClick={() => handleClick("Report")}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 
                ${activeTab === "Report" ? "bg-violet-700 text-white" : "bg-transparent text-gray-500"}`}
            >
              <HiOutlineDocumentReport className="text-xl" />
            </div>
            <span className="transition-all duration-300">Report</span>
          </div>


          <hr className="border-t border-gray-300 " />


          
        </nav>
        <img src={flightravelimg} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-0 ml-64 bg-white w-fit h-fit">
        {activeTab === "Dashboard" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <AirTravel />
          </div>
        )}

        {/* Flight Booking Widget */}
        {activeTab === "flightTravel" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <FlightTravels />
          </div>
        )}

        {activeTab === "FlightBooking" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <FlightBooking />
          </div>
        )}


        {activeTab === "rentvehicle" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <RentVehicle />
          </div>
        )}
        
        {activeTab === "UserFlightSeat" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <UserFlightSeat />
          </div>
        )}

        {activeTab === "Help" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <BasicRideHistory />
          </div>
        )}

        {activeTab === "Report" && (
          <div className=" p-6 rounded-lg shadow-lg">
            <Report />
          </div>
        )}
      </div>
    </div>
  );
}
