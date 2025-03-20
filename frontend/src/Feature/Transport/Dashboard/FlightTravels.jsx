import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const FlightTravels = () => {
  const [travels, setTravels] = useState([]);
  const [editingTravel, setEditingTravel] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/airtaxitravels");
      setTravels(response.data);
    } catch (error) {
      console.error("Error fetching travel details:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/airtaxitravels/${id}`);
      setTravels(travels.filter((travel) => travel._id !== id));
    } catch (error) {
      console.error("Error deleting travel:", error);
    }
  };

  const handleEdit = (travel) => {
    setEditingTravel(travel._id);
    setFormData(travel);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/airtaxitravels/${editingTravel}`, formData);
      setEditingTravel(null);
      fetchTravels();
    } catch (error) {
      console.error("Error updating travel:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-center gap-6">
        {travels.map((travel) => (
          <div key={travel._id} className="bg-white shadow-lg rounded-lg p-6 w-[400px] border-2 border-gray-300 relative">
            <div className="text-center bg-black text-white py-2 font-bold text-lg uppercase">
              {travel.airtaxiName}
            </div>
            <div className="flex justify-between items-center my-6">
              <div className="text-center">
                <h3 className="text-gray-600">DEPARTURE</h3>
                <p className="font-bold text-xl">{travel.departure}</p>

                <p className="font-semibold text-1xl">
                  {new Date(travel.departure_datetime).toLocaleString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
                
                <p className="font-semibold text-1xl">
                  {new Date(travel.departure_datetime).toLocaleString("en-US", {
                    hour: "2-digit", minute: "2-digit", hour12: true
                  })}
                </p>

              </div>
              <FaPlane className="text-3xl text-black rotate-90" />
              <div className="text-center">
                <h3 className="text-gray-600">DESTINATION</h3>
                <p className="font-bold text-xl">{travel.destination}</p>
                <p className="font-semibold text-1xl">
                  {new Date(travel.destination_datetime).toLocaleString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
                
                <p className="font-semibold text-1xl">
                  {new Date(travel.destination_datetime).toLocaleString("en-US", {
                    hour: "2-digit", minute: "2-digit", hour12: true
                  })}
                </p>
              </div>

            </div>
            <div className="border-t border-gray-400 text-center mt-4 pt-2 font-bold text-lg">
              TICKET FEE : {travel.ticket_price} LKR
            </div>
            <div className="flex justify-center mt-5 space-x-2">
              <Link to={`/transport/express-ride/seat-booking/${travel._id}`}>
                <button className="bg-purple-300 text-purple-950 rounded-xl font-bold px-6 py-2">BOOK</button>
              </Link>
              <button onClick={() => handleEdit(travel)} className="bg-blue-400 text-white rounded-xl font-bold px-6 py-2">EDIT</button>
              <button onClick={() => handleDelete(travel._id)} className="bg-red-400 text-white rounded-xl font-bold px-6 py-2">DELETE</button>
            </div>

            {editingTravel === travel._id && (
              <div className="absolute top-0 left-0 w-full h-full bg-white shadow-xl p-4 z-10">

                <form onSubmit={handleUpdate}>
                  <h2 className="text-xl font-bold mb-3">Update Travel</h2>
                  {/*
                  <input type="text" value={formData.departure} 
                      onChange={(e) => setFormData({...formData, departure: e.target.value})} 
                      className="border p-2 w-full mb-2" 
                  />

                  <input type="text" value={formData.destination} 
                      onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                      className="border p-2 w-full mb-2" 
                  /> 

                  <input type="text" value={formData.ticket_price} 
                      onChange={(e) => setFormData({...formData, ticket_price: e.target.value})} 
                      className="border p-2 w-full mb-2" 
                  /> */}

                  <p>departure_datetime</p>
                  <input
                    type="datetime-local"
                    name="departure_datetime"
                    value={formData.departure_datetime}
                    onChange={(e) => setFormData({...formData, departure_datetime: e.target.value})} 
                    className="w-full p-3 border rounded"
                    min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)} // Minimum 2 hours from now
                  />

                  <p>destination_datetime</p>
                  <input
                    type="datetime-local"
                    name="destination_datetime"
                    value={formData.destination_datetime}
                    onChange={(e) => setFormData({...formData, destination_datetime: e.target.value})} 
                    className="w-full p-3 border rounded"
                    min={formData.departure_datetime} // Minimum 2 hours from now
                  />

                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setEditingTravel(null)} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </form>

              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightTravels;