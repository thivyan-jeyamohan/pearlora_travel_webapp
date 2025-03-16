import { useState } from "react";
import axios from "axios";

const AddTravelForm = () => {
  const [formData, setFormData] = useState({
    airtaxiName: "",
    departure: "",
    destination: "",
    departure_datetime: "",
    destination_datetime: "",
    ticket_price: "",
    seats: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const departureTime = new Date(formData.departure_datetime);
    const destinationTime = new Date(formData.destination_datetime);

    // Validate departure time (must be at least 2 hours from now)
    if (departureTime - now < 2 * 60 * 60 * 1000) {
      alert("Departure time must be at least 2 hours from now.");
      return;
    }

    // Validate destination time (must be after departure time, even if it's the same day)
    if (destinationTime <= departureTime) {
      alert("Destination time must be later than departure time.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/travels", formData);
      alert("Travel added successfully!");
      console.log(response.data);
      setFormData({
        airtaxiName: "",
       
        departure: "",
        destination: "",
        departure_datetime: "",
        destination_datetime: "",
        ticket_price: "",
        seats: "",
      });
    } catch (error) {
      console.error("Error adding travel:", error);
      alert("Failed to add travel.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-5">Add Air Taxi Travel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="airtaxiName"
          placeholder="Air Taxi Name"
          value={formData.airtaxiName}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

     
       

<select
  name="departure"
  value={formData.departure}
  onChange={handleChange}
  className="w-full p-3 border rounded"
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


        

        <p>departure_datetime</p>
        {/* Departure Date & Time */}
        <input
          type="datetime-local"
          name="departure_datetime"
          value={formData.departure_datetime}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)} // Minimum 2 hours from now
          required
        />

       

<select
  name="destination"
  value={formData.destination}
  onChange={handleChange}
  className="w-full p-3 border rounded"
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
        
        {/* Destination Date & Time */}
        <p>destination_datetime</p>
        <input
          type="datetime-local"
          name="destination_datetime"
          value={formData.destination_datetime}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          min={formData.departure_datetime} // Ensures it's at least the same as departure time
          required
        />
        <input
          type="number"
          name="ticket_price"
          placeholder="Ticket Price (LKR)"
          value={formData.ticket_price}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={formData.seats}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Add Travel
        </button>
      </form>
    </div>
  );
};

export default AddTravelForm;
