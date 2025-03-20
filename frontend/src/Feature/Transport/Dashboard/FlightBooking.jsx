import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";


const FlightBooking = () => {
  const [travels, setTravels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/airseats");
      setTravels(response.data);
    } catch (error) {
      console.error("Error fetching travel details:", error);
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
              
                <button className="bg-purple-300 text-purple-950 rounded-xl font-bold px-6 py-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  BOOK
                </button>
             

              {/* Modal (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 mt-10">
          <div className="bg-white p-2 rounded-lg shadow-lg w-150">
            
          <button onClick={() => setIsModalOpen(false)} className=" font-black text-2xl text-black mt-0 px-2 py-2 rounded-full">
              <IoClose />
            </button>
            {/* 📌 Embed seat booking page */}
            <iframe
              src={`/transport-admin-seatbook/${travel._id}`} 
              className="w-full h-[590px]  rounded" 
           
            ></iframe>

           
            
          </div>
        </div>
      )}
             
            </div>

            

          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightBooking;