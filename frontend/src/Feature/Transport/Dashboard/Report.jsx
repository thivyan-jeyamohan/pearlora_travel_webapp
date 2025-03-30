import RAirtaxitravels from "../Report/RAirtaxitravels";

export default function Report() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        <button className="bg-black text-white rounded-full py-2 px-4">
          Air Taxi Travels
        </button>
        <button className="bg-black text-white rounded-full py-2 px-4">
          Basic Rides
        </button>
        <button className="bg-black text-white rounded-full py-2 px-4">
          Air Taxi Seat Bookings
        </button>
        <button className="bg-black text-white rounded-full py-2 px-4">
          Air Taxi GPS
        </button>
      </div>
      <div>
        <RAirtaxitravels />
      </div>
    </div>
  );
}
