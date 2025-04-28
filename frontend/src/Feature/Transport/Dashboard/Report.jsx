import React, { useState } from "react";
import RAirtaxitravels from "../Report/RAirtaxitravels";
import AirSeatsTable from "../Report/AirSeatsTable"; 
import BasicRidesTable from "../Report/BasicRidesTable"

export default function Report() {
  const [activeComponent, setActiveComponent] = useState("AirTaxiTravels");

  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        <button
          className="bg-black text-white rounded-full py-2 px-4"
          onClick={() => handleButtonClick("AirTaxiTravels")}
        >
          Air Taxi Travels
        </button>
        <button
          className="bg-black text-white rounded-full py-2 px-4"
          onClick={() => handleButtonClick("BasicRides")}
        >
          Basic Rides
        </button>
        <button
          className="bg-black text-white rounded-full py-2 px-4"
          onClick={() => handleButtonClick("AirSeatsTable")}
        >
          Air Taxi Seat Bookings
        </button>
        
      </div>
      <div>
        {activeComponent === "AirTaxiTravels" && <RAirtaxitravels />}
        {activeComponent === "AirSeatsTable" && <AirSeatsTable />}
        {activeComponent === "BasicRides" && <BasicRidesTable /> } 
        
      </div>
    </div>
  );
}
