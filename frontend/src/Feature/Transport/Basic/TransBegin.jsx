import React, { useState, useEffect } from 'react';
import travelerImage from '../../../assets/TransportBanner.png';
import { Link } from 'react-router-dom';


function TransBegin() {

  const [vehicles, setVehicles] = useState([]);

  // 👇 Fetch Vehicles from Backend
    async function fetchVehicles() {
      try {
        const res = await fetch('http://localhost:5000/api/vehicles');
        const data = await res.json();
        if (res.ok) {
          setVehicles(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  
    useEffect(() => {
      fetchVehicles(); // Load vehicles initially
    }, []);


  return (
    <>

 
    <div className="relative w-full h-110 bg-cover bg-center flex items-center justify-center mt-20 "
          style={{ backgroundImage: `url(${travelerImage})` }} >  
    </div>

    <div className='bg-blue-50 pt-20'>
      <h1 className="text-4xl font-bold text-center">Book Your Ride – Fast, Easy & Reliable</h1>
      <p className="text-lg text-center">Choose your vehicle, select your dates, and start your journey hassle-free.</p>
      
      <div className="flex justify-center gap-20 mt-7">

        <button
          className="bg-gradient-to-r from-purple-950 to-purple-800 text-white font-bold text-lg px-10 py-3 rounded-4xl"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Basic Ride
        </button>


        <Link to="/express-ride">
          <button
            className="bg-gradient-to-r from-purple-950 to-purple-800 text-white font-bold text-lg px-10 py-3 rounded-4xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Express Ride
          </button>
        </Link>
        
      </div>
    </div>

    <div className='bg-blue-50 pt-20 flex justify-center items-center '>


    <div className="flex flex-wrap justify-center">
      {vehicles.map(vehicle => (
        <button
          key={vehicle._id}
          className="bg-gradient-to-r from-blue-900 to-blue-500 text-white font-bold text-lg px-10 py-3 rounded-4xl m-4"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {vehicle.vehicleName} : {vehicle.price}/Day
        </button>
      ))}
    </div>


    </div>
    </>
  );
}

export default TransBegin;
