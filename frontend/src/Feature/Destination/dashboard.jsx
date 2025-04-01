import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaList, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import AddDestination from "../../Feature/Destination/Dashboard/AddDestination";
import EditDestination from "../../Feature/Destination/Dashboard/EditDestination";
import RemoveDestination from "../../Feature/Destination/Dashboard/RemoveDestination";
import BookingList from "../../Feature/Destination/Dashboard/userList";
import GPSTracking from "../../Feature/Destination/Dashboard/GPSTracking";
import Report from "../../Feature/Destination/Dashboard/report"; // Correct import

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("add");
  const [isExpanded, setIsExpanded] = useState(false);

  const renderComponent = () => {
    switch (selectedOption) {
      case "add":
        return <AddDestination />;
      case "edit":
        return <EditDestination />;
      case "remove":
        return <RemoveDestination />;
      case "bookingList":
        return <BookingList />;
      case "gpsTracking":
        return <GPSTracking />;
      case "report":
        return <Report className />; // Correct rendering for the Report component
      default:
        return <AddDestination />;
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed h-full p-4 transition-all duration-300 shadow-lg ${isExpanded ? "w-64 bg-white" : "w-20 bg-white"}`} 
        onMouseEnter={() => setIsExpanded(true)} 
        onMouseLeave={() => setIsExpanded(false)}
      >
        <h2 className={`text-xl font-semibold text-center mb-6 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>Admin Panel</h2>
        <ul className="space-y-6">
          <li className={`cursor-pointer flex items-center p-3 rounded-md hover:bg-gray-200 ${selectedOption === "add" ? "bg-gray-300" : ""}`} onClick={() => setSelectedOption("add")}>
            <FaPlus className="text-lg" />
            {isExpanded && <span className="ml-4">Add Destination</span>}
          </li>
          <li className={`cursor-pointer flex items-center p-3 rounded-md hover:bg-gray-200 ${selectedOption === "edit" ? "bg-gray-300" : ""}`} onClick={() => setSelectedOption("edit")}>
            <FaEdit className="text-lg" />
            {isExpanded && <span className="ml-4">Edit Destination</span>}
          </li>
          <li className={`cursor-pointer flex items-center p-3 rounded-md hover:bg-gray-200 ${selectedOption === "remove" ? "bg-gray-300" : ""}`} onClick={() => setSelectedOption("remove")}>
            <FaTrash className="text-lg" />
            {isExpanded && <span className="ml-4">Remove Destination</span>}
          </li>
          <li className={`cursor-pointer flex items-center p-3 rounded-md hover:bg-gray-200 ${selectedOption === "bookingList" ? "bg-gray-300" : ""}`} onClick={() => setSelectedOption("bookingList")}>
            <FaList className="text-lg" />
            {isExpanded && <span className="ml-4">Booking List</span>}
          </li>
          <li className={`cursor-pointer flex items-center p-3 rounded-md hover:bg-gray-200 ${selectedOption === "gpsTracking" ? "bg-gray-300" : ""}`} onClick={() => setSelectedOption("gpsTracking")}>
            <FaMapMarkerAlt className="text-lg" />
            {isExpanded && <span className="ml-4">GPS Tracking</span>}
          </li>
          <li className={`cursor-pointer flex items-center p-3 rounded-md hover:bg-gray-200 ${selectedOption === "report" ? "bg-gray-300" : ""}`} onClick={() => setSelectedOption("report")}>
            <FaFileAlt className="text-lg" />
            {isExpanded && <span className="ml-4">Report Generate</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-20 md:ml-64">
        <div className="bg-white p-8 rounded-lg shadow-lg">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
