import React, { useState, useEffect } from 'react';
import { FaCarSide } from 'react-icons/fa'; // 🚗 Car Icon
import logo from "../../../assets/logo.png"
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { BsFillSave2Fill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";


function RentVehicle() {

  const [formData, setFormData] = useState({
    vehicleName: '',
    serialId: '',
    price: ''
  });

  const [vehicles, setVehicles] = useState([]); 
  

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function toggleEdit(id, editing) {
    const updated = vehicles.map(v =>
      v._id === id
        ? { ...v, editing, newPrice: v.price }
        : { ...v, editing: false }
    );
    setVehicles(updated);
  }
  
  async function handleUpdatePrice(id, newPrice) {
    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price: parseFloat(newPrice) })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Price updated successfully');
        fetchVehicles();
      } else {
        alert(data.error || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  }
  

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicleName: formData.vehicleName,
          serialId: formData.serialId,
          price: parseFloat(formData.price)
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Vehicle added successfully!');
        setFormData({ vehicleName: '', serialId: '', price: '' });

        // After adding, fetch all vehicles again
        fetchVehicles();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  }

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
    <div className="p-8">

      {/* Add Vehicle Form */}
      <form onSubmit={handleSubmit} className="flex gap-4 items-center flex-wrap">
        
        {/* Vehicle Name */}
        <div className="flex items-center border-2 border-purple-700 rounded-full px-4 py-2 bg-white">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3">
            <FaCarSide className="text-white text-lg" />
          </div>
          <input
            type="text"
            name="vehicleName"
            placeholder="Vehicle Name"
            value={formData.vehicleName}
            onChange={handleChange}
            className="outline-none bg-transparent text-base"
            required
          />
        </div>

        {/* Serial ID */}
        <div className="flex items-center border-2 border-purple-700 rounded-full px-4 py-2 bg-white">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3">
            <FaCarSide className="text-white text-lg" />
          </div>
          <input
            type="text"
            name="serialId"
            placeholder="Serial ID"
            value={formData.serialId}
            onChange={handleChange}
            className="outline-none bg-transparent text-base"
            required
          />
        </div>

        {/* Price */}
        <div className="flex items-center border-2 border-purple-700 rounded-full px-4 py-2 bg-white">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3">
            <FaCarSide className="text-white text-lg" />
          </div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="outline-none bg-transparent text-base"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:scale-105 transition"
        >
          Add Vehicle
        </button>

      </form>

      {/* Vehicles List */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
  <div key={vehicle._id} className="p-6 rounded-xl shadow-lg border border-purple-300 bg-white hover:shadow-2xl transition">
    <div className="flex items-center mb-4">
      <FaCarSide className="text-purple-700 text-3xl mr-3" />
      <h2 className="text-xl font-bold">{vehicle.vehicleName}</h2>
    </div>
    <p className="text-gray-600"><strong>Serial ID:</strong> {vehicle.serialId}</p>

    {/* Editable Price */}
    <div className="flex items-center gap-2 mt-2">
      <p className="text-gray-600 font-medium">Price:</p>
      {vehicle.editing ? (
        <>
          <input
            type="number"
            value={vehicle.newPrice}
            onChange={(e) => {
              const updatedVehicles = vehicles.map(v =>
                v._id === vehicle._id ? { ...v, newPrice: e.target.value } : v
              );
              setVehicles(updatedVehicles);
            }}
            className="border border-gray-400 px-2 py-1 rounded-md"
          />
          <button
            onClick={() => handleUpdatePrice(vehicle._id, vehicle.newPrice)}
            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            <BsFillSave2Fill />

          </button>
          <button
            onClick={() => toggleEdit(vehicle._id, false)}
            className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm"
          >
            <MdCancel />

          </button>
        </>
      ) : (
        <>
          <p>${vehicle.price}</p>
          <button
            onClick={() => toggleEdit(vehicle._id, true)}
            className="ml-3 text-sm text-blue-600 underline"
          >
            <BiSolidMessageSquareEdit />

          </button>
        </>
      )}
    </div>
  </div>
))}

      </div>

    </div>
  );
}

export default RentVehicle;
