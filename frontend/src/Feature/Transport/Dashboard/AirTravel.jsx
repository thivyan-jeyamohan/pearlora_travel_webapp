import { useState } from "react";
import axios from "axios";
import { CalendarDays, Users, MapPin } from "lucide-react";
import air from "../../../assets/airtaxiflight.jpg";
import mapvid from "../../../assets/map.mp4";
import { MdMailOutline } from "react-icons/md";

export default function AirTravel() {

  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Track visibility of the chatbot
  
    const toggleChatbot = () => {
      setIsChatbotOpen((prevState) => !prevState); // Toggle chatbot visibility
    };


  const [formData, setFormData] = useState({
    airtaxiName: "",
    departure: "",
    destination: "",
    departure_datetime: "",
    destination_datetime: "",
    ticket_price: "",
    airtaxicompanymail: "",
    seats: 100,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const departureTime = new Date(formData.departure_datetime);
    const destinationTime = new Date(formData.destination_datetime);

   
    if (departureTime - now < 2 * 60 * 60 * 1000) {
      alert("Departure time must be at least 2 hours from now.");
      return;
    }

   
    if (destinationTime <= departureTime) {
      alert("Destination time must be later than departure time.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/airtaxitravels",
        formData,
      );
      alert("Travel added successfully!");
      console.log(response.data);
      setFormData({
        airtaxiName: "",
        departure: "",
        destination: "",
        departure_datetime: "",
        destination_datetime: "",
        ticket_price: "",
        airtaxicompanymail: "",
        seats: 100,
      });
    } catch (error) {
      console.error("Error adding travel:", error);
      alert("Failed to add travel.");
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-xl rounded-2xl p-6 max-w-5xl">
        {/* Left Section - Image */}
        <div className="hidden md:flex w-1/2">
          <img
            src={air}
            alt="Airplane"
            className="rounded-xl w-full h-full object-cover"
          />
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold">
            Let's Add AirTaxi
            <span className="text-gray-500"> New Trip</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center border p-3 rounded-lg">
                <MapPin className="text-blue-500" />
                <div className="ml-3 w-full">
                  <p className="text-xs text-gray-400">Air Taxi Name</p>

                  <input
                    type="text"
                    name="airtaxiName"
                    placeholder="Enter Air Taxi Name"
                    value={formData.airtaxiName}
                    onChange={handleChange}
                    className="bg-transparent text-sm font-medium outline-none w-full"
                    required
                    pattern="[A-Za-z0-9 ]*"
                    title="Only letters and numbers are allowed"
                  />


                </div>
              </div>

              <div className="flex items-center border p-3 rounded-lg">
                <Users className="text-blue-500" />
                <div className="ml-3 w-full">
                  <p className="text-xs text-gray-400">Ticket Price (LKR)</p>
                  <input
                    type="number"
                    name="ticket_price"
                    placeholder="Enter Ticket Price"
                    value={formData.ticket_price}
                    onChange={handleChange}
                    className="bg-transparent text-sm font-medium outline-none w-full"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Departure Location */}
            <div className="flex items-center border p-3 rounded-lg">
              <MapPin className="text-blue-500" />
              <div className="ml-3 w-full">
                <p className="text-xs text-gray-400">From (Departure)</p>
                <select
                  type="text"
                  name="departure"
                  placeholder="Enter Departure Location"
                  value={formData.departure}
                  onChange={handleChange}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  required
                >
                  <option value="">Select Departure Location</option>
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
              </div>
            </div>

            {/* Departure DateTime */}
            <div className="flex items-center border p-3 rounded-lg">
              <CalendarDays className="text-blue-500" />
              <div className="ml-3 w-full">
                <p className="text-xs text-gray-400">Departure Date & Time</p>
                <input
                  type="datetime-local"
                  name="departure_datetime"
                  value={formData.departure_datetime}
                  onChange={handleChange}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  min={new Date(Date.now() + 2 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 16)} // Minimum 2 hours from now
                  required
                />
              </div>
            </div>

            {/* Destination Location */}
            <div className="flex items-center border p-3 rounded-lg">
              <MapPin className="text-blue-500" />
              <div className="ml-3 w-full">
                <p className="text-xs text-gray-400">To (Destination)</p>

                <select
                  type="text"
                  name="destination"
                  placeholder="Enter Destination Location"
                  value={formData.destination}
                  onChange={handleChange}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  required
                >
                  <option value="">Select Departure Location</option>
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
              </div>
            </div>

            {/* Destination DateTime */}
            <div className="flex items-center border p-3 rounded-lg">
              <CalendarDays className="text-blue-500" />
              <div className="ml-3 w-full">
                <p className="text-xs text-gray-400">Arrival Date & Time</p>
                <input
                  type="datetime-local"
                  name="destination_datetime"
                  value={formData.destination_datetime}
                  onChange={handleChange}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  min={formData.departure_datetime} 
                  required
                />
              </div>
            </div>

            <div className="flex items-center border p-3 rounded-lg">
              <MdMailOutline className="text-blue-500 text-[25px]" />
              <div className="ml-3 w-full">
                <p className="text-xs text-gray-400">Air Taxi Company Mail</p>
                <input
                  type="email"
                  name="airtaxicompanymail"
                  placeholder="Enter Air Taxi Company Mail"
                  value={formData.airtaxicompanymail}
                  onChange={handleChange}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  required
                />
              </div>
            </div>

            {/* Seats */}
            <div className="flex items-center border p-3 rounded-lg hidden">
              <Users className="text-blue-500" />
              <div className="ml-3 w-full">
                <p className="text-xs text-gray-400">Total Seats</p>
                <input
                  type="number"
                  name="seats"
                  placeholder="Seats"
                  value={formData.seats}
                  onChange={() => {}}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Add Travel
            </button>
          </form>
        </div>
      </div>
      <div>
        <video
          src={mapvid}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-xl w-full h-full object-cover"
        />
      </div>

      
    </div>
  );
}
