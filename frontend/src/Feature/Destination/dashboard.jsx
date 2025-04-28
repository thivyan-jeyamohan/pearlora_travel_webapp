import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaList, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import AddDestination from "../../Feature/Destination/Dashboard/AddDestination";
import EditDestination from "../../Feature/Destination/Dashboard/EditDestination";
import RemoveDestination from "../../Feature/Destination/Dashboard/RemoveDestination";
import BookingList from "../../Feature/Destination/Dashboard/userList";
import Status from "./Dashboard/Status";
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
        return <Status />;
      case "report":
        return <Report />;
      default:
        return <AddDestination />;
    }
  };

  const menuItems = [
    { id: "add", icon: <FaPlus />, label: "Add Destination" },
    { id: "edit", icon: <FaEdit />, label: "Edit Destination" },
    { id: "remove", icon: <FaTrash />, label: "Remove Destination" },
    { id: "bookingList", icon: <FaList />, label: "Booking List" },
    { id: "gpsTracking", icon: <FaMapMarkerAlt />, label: "Status" },
    { id: "report", icon: <FaFileAlt />, label: "Report Generate" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full p-4 transition-all duration-300 shadow-lg border-r border-gray-200 ${isExpanded ? "w-64" : "w-20"} bg-white`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <h2
          className={`text-2xl font-bold text-blue-600 text-center mb-8 transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          Admin
        </h2>

        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelectedOption(item.id)}
              className={`group flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-300 relative ${
                selectedOption === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {selectedOption === item.id && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-lg"></span>
              )}
              <div className="text-lg">{item.icon}</div>
              {isExpanded && <span className="ml-4 font-medium">{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 p-6 ${isExpanded ? "ml-64" : "ml-20"}`}>
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[80vh] flex flex-col">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
