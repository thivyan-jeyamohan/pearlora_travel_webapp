import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SeatBook = () => {
  const { travelId } = useParams();
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [unbookedSeats, setUnbookedSeats] = useState([]); // Track seats to unbook

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
      // If already booked, allow unbooking
      setUnbookedSeats((prev) =>
        prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
      );
    } else {
      // If not booked, allow booking
      setSelectedSeats((prev) =>
        prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
      );
    }
  };

  const confirmSeats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/airseats/update/${travelId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookedSeats: selectedSeats, unbookedSeats }),
        },
      );

      if (response.ok) {
        setSeatData((prev) => ({
          ...prev,
          bookedSeats: [
            ...prev.bookedSeats.filter((seat) => !unbookedSeats.includes(seat)), // Remove unbooked
            ...selectedSeats, // Add newly booked
          ],
        }));
        setSelectedSeats([]);
        setUnbookedSeats([]);
        alert("Seats updated successfully!");
      }
    } catch (error) {
      console.error("Error updating seat data:", error);
    }
  };

  if (!seatData) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="flex flex-col items-center p-5 ">
      <div className="grid grid-cols-2 gap-2">
        {/* Left Side Seats (First 50) */}
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
                  ? "bg-red-600" // Unbooking seats turn red
                  : "bg-green-600" // Booked seats are green
                : isSelected
                  ? "bg-purple-500" // Selected seats are purple
                  : "bg-blue-300 hover:bg-purple-300" // Available seats
            }`}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </button>
            );
          })}
        </div>

        {/* Right Side Seats (Next 50) */}
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
                  ? "bg-red-600" // Unbooking seats turn red
                  : "bg-green-600" // Booked seats are green
                : isSelected
                  ? "bg-purple-500" // Selected seats are purple
                  : "bg-blue-300 hover:bg-purple-300" // Available seats
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

export default SeatBook;
