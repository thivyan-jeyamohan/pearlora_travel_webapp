import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import RAirtaxitravelList from "./RAirtaxitravelList";  // Import RAirtaxitravelsList for filtered results

const RAirtaxitravels = () => {
  const [destinationFrom, setDestinationFrom] = useState("");
  const [destinationTo, setDestinationTo] = useState("");
  const [date, setDate] = useState("");
  const [filters, setFilters] = useState({
    departure: "",
    destination: "",
    date: "",
  });

  const [showReport, setShowReport] = useState(false);  // State to toggle report visibility

  const handleSearch = () => {
    setFilters({
      departure: destinationFrom,
      destination: destinationTo,
      date,
    });
    setShowReport(false);  // Reset report visibility after search
  };

  const handleViewReport = () => {
    setShowReport(true);  // Show the report when the button is clicked
  };

  return (
    <div>
      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">

        {/* Search Bar */}
        <div className="py-3 px-4 flex items-center justify-between shadow-md max-w-250 mx-auto gap-5 bg-blue-200 rounded-full mt-20">
          <select
            value={destinationFrom}
            onChange={(e) => setDestinationFrom(e.target.value)}
            className="px-7 py-5 text-black outline-none w-150 rounded-full bg-white"
          >
            <option value="">Select Departure</option>
            <optgroup label="Western Province">
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kalutara">Kalutara</option>
            </optgroup>
            {/* Add other provinces as needed */}
          </select>

          <select
            value={destinationTo}
            onChange={(e) => setDestinationTo(e.target.value)}
            className="px-7 py-5 text-black outline-none w-150 rounded-full bg-white"
          >
            <option value="">Select Destination</option>
            <optgroup label="Western Province">
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kalutara">Kalutara</option>
            </optgroup>
            {/* Add other provinces as needed */}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="px-7 py-5 text-black outline-none bg-white rounded-full"
          />

          <button onClick={handleSearch} className="bg-purple-900 text-white px-7 rounded-full py-5">
            <FaSearch />
          </button>

          
        </div>
      </div>

      {/* Display Filtered Travel List */}
      <RAirtaxitravelList filters={filters} />

    </div>
  );
};

export default RAirtaxitravels;
