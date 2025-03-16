import React, { useState } from "react";

const rows = 5;
const cols = 5;
const totalSeats = 100;
const leftSeats = 50;
const rightSeats = 100;

const SeatBooking = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
  };

  const confirmSeats = () => {
    setConfirmedSeats([...confirmedSeats, ...selectedSeats]);
    setSelectedSeats([]);
  };

  const renderSeats = (start, end, side) => {
    return (
      <div className="grid grid-cols-5 gap-2"> 
        {Array.from({ length: end - start + 1 }, (_, i) => {
          const seatNumber = start + i;
          const isSelected = selectedSeats.includes(seatNumber);
          const isConfirmed = confirmedSeats.includes(seatNumber);
          return (
            <button
              key={seatNumber}
              className={`w-10 h-10 rounded text-white text-sm flex items-center justify-center 
                ${isConfirmed ? "bg-green-500" : isSelected ? "bg-purple-500" : "bg-blue-300 hover:bg-purple-300"}`}
              onClick={() => !isConfirmed && toggleSeat(seatNumber)}
            >
              {side}{seatNumber}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-5 mt-20">
      <h2 className="text-xl font-bold mb-4">AirTaxi Seat Booking</h2>
      <div className="flex gap-8">
        <div>{renderSeats(1, leftSeats, "L")}</div>
        <div className="w-10"></div> {/* Middle space */}
        <div>{renderSeats(leftSeats + 1, totalSeats, "R")}</div>
      </div>
      <button 
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
        onClick={confirmSeats} 
        disabled={selectedSeats.length === 0}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default SeatBooking;