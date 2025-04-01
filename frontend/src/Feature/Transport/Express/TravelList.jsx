import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlane } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const TravelList = ({ filters }) => {
  const [travels, setTravels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/airSeats");
        setTravels(response.data);
      } catch (error) {
        console.error("Error fetching travel details:", error);
      }
    };
    fetchTravels();
  }, []);

  
  const filteredTravels = travels.filter((travel) => {
    return (
      (!filters.departure || travel.departure === filters.departure) &&
      (!filters.destination || travel.destination === filters.destination) &&
      (!filters.date || travel.departure_datetime.startsWith(filters.date))
    );
  });

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {filteredTravels.length > 0 ? (
        filteredTravels.map((travel) => (
          <div
            key={travel._id}
            className="bg-white shadow-lg rounded-lg p-6 w-[400px] border-2 border-gray-300"
          >
           
            <div className="text-center bg-black text-white py-2 font-bold text-lg uppercase">
              {travel.airtaxiName}
            </div>

            
            <div className="flex justify-between items-center my-6">
              <div className="text-center">
                <h3 className="text-gray-600">DEPARTURE PLACE</h3>
                <p className="font-bold text-xl">{travel.departure}</p>
                <p className="font-bold">
                  {new Date(travel.departure_datetime).toLocaleString()}
                </p>
              </div>

              <FaPlane className="text-3xl text-black rotate-90" />

              <div className="text-center">
                <h3 className="text-gray-600">DESTINATION PLACE</h3>
                <p className="font-bold text-xl">{travel.destination}</p>
                <p className="font-bold">
                  {new Date(travel.destination_datetime).toLocaleString()}
                </p>
              </div>
            </div>

          
            <div className="border-t border-gray-400 text-center mt-4 pt-2 font-bold text-lg">
              TICKET FEE : {travel.ticket_price} LKR
            </div>

           
            <div className="flex justify-center mt-5">
              <Link to={`/transport/express-ride/seat-booking/${travel._id}`}>
                <button className="bg-purple-300 text-purple-950 rounded-4xl font-bold px-10 py-2">
                  BOOK
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          No matching travel details found.
        </p>
      )}
    </div>
  );
};

export default TravelList;
