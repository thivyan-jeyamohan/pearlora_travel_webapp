import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import PlaneImg from "../../../assets/plane-banner.jpg";

const ExpressIntro = ({ onFilterChange }) => {
  const [destinationFrom, setDestinationFrom] = useState("");
  const [destinationTo, setDestinationTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    onFilterChange({
      departure: destinationFrom,
      destination: destinationTo,
      date,
    });
  };

  return (
    <div
      className="relative w-full h-180 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${PlaneImg})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Millions Of Experiences.
          <br /> One Simple Search.
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Find what makes you happy anytime, anywhere
        </p>

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
    </div>
  );
};

export default ExpressIntro;
