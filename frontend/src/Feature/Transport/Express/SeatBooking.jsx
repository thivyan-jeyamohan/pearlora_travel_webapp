import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SeatBooking = () => {
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flightId"); // Get flightId from URL
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!flightId) return;

    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/seats?flightId=${flightId}`);
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [flightId]);

  // Handle seat selection
  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-bold text-center">Select Your Seats</h2>

      <div className="grid grid-cols-6 gap-3 mt-6 justify-center">
        {seats.map((seat) => (
          <div
            key={seat.number}
            className={`p-4 border rounded-lg text-center font-bold cursor-pointer
              ${seat.status === "booked" ? "bg-red-500 text-white" : ""}
              ${selectedSeats.includes(seat.number) ? "bg-purple-500 text-white" : ""}
              ${seat.status === "available" ? "bg-blue-300" : ""}`}
            onClick={() => {
              if (seat.status !== "booked") {
                toggleSeatSelection(seat.number);
              }
            }}
          >
            {seat.number}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          className="bg-green-500 text-white font-bold px-6 py-2 rounded-lg"
          onClick={async () => {
            if (selectedSeats.length === 0) return alert("No seats selected!");

            try {
              await axios.post("http://localhost:5000/api/book-seat", {
                flightId,
                seats: selectedSeats,
              });

              alert("Seats booked successfully!");
              window.location.reload(); // Refresh to update seat colors
            } catch (error) {
              console.error("Error booking seats:", error);
            }
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default SeatBooking;
