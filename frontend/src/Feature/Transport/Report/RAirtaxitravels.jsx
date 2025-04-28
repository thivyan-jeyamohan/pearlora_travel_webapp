import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import RAirtaxitravelList from "./RAirtaxitravelList"; 

const RAirtaxitravels = () => {
  const [destinationFrom, setDestinationFrom] = useState("");
  const [destinationTo, setDestinationTo] = useState("");
  const [date, setDate] = useState("");
  const [filters, setFilters] = useState({
    departure: "",
    destination: "",
    date: "",
  });

  const [showReport, setShowReport] = useState(false); 

  const handleSearch = () => {
    setFilters({
      departure: destinationFrom,
      destination: destinationTo,
      date,
    });
    setShowReport(false); 
  };

  const handleViewReport = () => {
    setShowReport(true); 
  };

  return (
    <div>
    
      <div className="relative z-10 text-center text-white px-6">
        {/* Search Bar */}
        <div className="py-3 px-4 flex items-center justify-between shadow-md max-w-250 mx-auto gap-5 bg-blue-200 rounded-full mt-10">
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
              <optgroup label="Central Province">
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
              </optgroup>
              <optgroup label="Southern Province">
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
              </optgroup>
              <optgroup label="Northern Province">
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullaitivu">Mullaitivu</option>
              </optgroup>
              <optgroup label="Eastern Province">
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
              </optgroup>
              <optgroup label="North-Western Province">
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
              </optgroup>
              <optgroup label="Sabaragamuwa Province">
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </optgroup>
              <optgroup label="Uva Province">
                <option value="Badulla">Badulla</option>
                <option value="Moneragala">Moneragala</option>
              </optgroup>
              <optgroup label="North-Central Province">
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
              </optgroup>            
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
            <optgroup label="Central Province">
              <option value="Kandy">Kandy</option>
              <option value="Matale">Matale</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
            </optgroup>
            <optgroup label="Southern Province">
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Hambantota">Hambantota</option>
            </optgroup>
            <optgroup label="Northern Province">
              <option value="Jaffna">Jaffna</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Mannar">Mannar</option>
              <option value="Vavuniya">Vavuniya</option>
              <option value="Mullaitivu">Mullaitivu</option>
            </optgroup>
            <optgroup label="Eastern Province">
              <option value="Batticaloa">Batticaloa</option>
              <option value="Ampara">Ampara</option>
              <option value="Trincomalee">Trincomalee</option>
            </optgroup>
            <optgroup label="North-Western Province">
              <option value="Kurunegala">Kurunegala</option>
              <option value="Puttalam">Puttalam</option>
            </optgroup>
            <optgroup label="Sabaragamuwa Province">
              <option value="Ratnapura">Ratnapura</option>
              <option value="Kegalle">Kegalle</option>
            </optgroup>
            <optgroup label="Uva Province">
              <option value="Badulla">Badulla</option>
              <option value="Moneragala">Moneragala</option>
            </optgroup>
            <optgroup label="North-Central Province">
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
            </optgroup>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="px-7 py-5 text-black outline-none bg-white rounded-full"
          />

          <button
            onClick={handleSearch}
            className="bg-purple-900 text-white px-7 rounded-full py-5"
          >
            <FaSearch />
          </button>
        </div>
      </div>

    
      <RAirtaxitravelList filters={filters} />
    </div>
  );
};

export default RAirtaxitravels;
