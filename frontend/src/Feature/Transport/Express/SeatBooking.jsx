import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import flightseat from "../../../assets/flightseats.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";

const SeatBooking = () => {
  const { travelId } = useParams();
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [unbookedSeats, setUnbookedSeats] = useState([]); 

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/airseats/${travelId}`,
        );
        const data = await response.json();
        if (data.success) {
          setSeatData(data.airSeat);
        }
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };

    fetchSeats();
  }, [travelId]);

  const toggleSeat = (seat) => {
    if (!seatData) return;

    if (seatData.bookedSeats.includes(seat)) {
      setUnbookedSeats((prev) =>
        prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
      );
    } else {
      setSelectedSeats((prev) =>
        prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
      );
    }
  };

  const confirmSeats = async () => {
    try {
      // 1. Update the seat data first
      const response = await fetch(
        `http://localhost:5000/api/airseats/update/${travelId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookedSeats: selectedSeats, unbookedSeats }),
        },
      );
  
      if (response.ok) {
        // Update frontend seatData
        setSeatData((prev) => ({
          ...prev,
          bookedSeats: [
            ...prev.bookedSeats.filter((seat) => !unbookedSeats.includes(seat)),
            ...selectedSeats,
          ],
        }));
        setSelectedSeats([]);
        setUnbookedSeats([]);
  
        alert("Seats updated successfully!");
  
        // 2. Now create a booking record
        const totalPrice = seatData.ticket_price * selectedSeats.length;
  
        const bookingData = {
          travelId: travelId,
          airtaxiName: seatData.airtaxiName,
          departure: seatData.departure,
          departure_datetime: seatData.departure_datetime,
          destination: seatData.destination,
          destination_datetime: seatData.destination_datetime,
          ticket_price: seatData.ticket_price,
          bookedSeats: selectedSeats,
          totalPrice: totalPrice,
          email: "user@example.com",
        };
  
        const bookingResponse = await fetch(
          `http://localhost:5000/api/flightbooking`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
          }
        );
  
        if (bookingResponse.ok) {
          console.log("Booking saved successfully!");
        } else {
          console.error("Failed to save booking.");
        }
      }
    } catch (error) {
      console.error("Error updating seat data:", error);
    }
  };
  

  if (!seatData) return <div className="text-center p-10">Loading...</div>;

  return (
    <div
      className="flex flex-col items-center p-20 mt-7 bg-cover bg-center"
      style={{ backgroundImage: `url(${flightseat})` }}
    >
      <div
        className="bg-white rounded-full p-1 mb-2"
        onClick={() => window.history.back()}
      >
        <IoMdArrowRoundBack size={40} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Left Side Seats */}
        <div className="grid grid-cols-5 gap-2 m-2">
          {seatData.seats.slice(0, 50).map((seat) => {
            const isBooked = seatData.bookedSeats.includes(seat);
            const isUnbooking = unbookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                className={`w-10 h-10  rounded text-white text-sm flex items-center justify-center
            ${
              isBooked
                ? isUnbooking
                  ? "bg-red-600" 
                  : "bg-green-600" 
                : isSelected
                  ? "bg-purple-500" 
                  : "bg-blue-800 hover:bg-purple-300" 
            }`}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </button>
            );
          })}
        </div>

        {/* Right Side Seats */}
        <div className="grid grid-cols-5 gap-2 m-2">
          {seatData.seats.slice(50, 100).map((seat) => {
            const isBooked = seatData.bookedSeats.includes(seat);
            const isUnbooking = unbookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                className={`w-10 h-10 rounded text-white text-sm flex items-center justify-center
            ${
              isBooked
                ? isUnbooking
                  ? "bg-red-600" 
                  : "bg-green-600" 
                : isSelected
                  ? "bg-purple-500" 
                  : "bg-blue-800 hover:bg-purple-300" 
            }`}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="mt-4 px-6 py-2 bg-violet-700 text-white rounded-full hover:bg-blue-700"
        onClick={confirmSeats}
        disabled={selectedSeats.length === 0 && unbookedSeats.length === 0}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default SeatBooking;
