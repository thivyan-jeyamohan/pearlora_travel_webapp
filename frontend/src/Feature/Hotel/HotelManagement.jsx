import React, { useState, useEffect } from 'react';
import HotelTable from './HotelTable';
import HotelForm from './HotelForm'; 
import API  from './services/api'; 

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);


  useEffect(() => {
    fetchHotels();
  }, []);

  // Fetch Hotels
  const fetchHotels = async () => {
    try {
      const response = await API.get('/hotels'); 
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Hotel Management</h1>

      {/* Add Hotel Button */}
      <button 
        onClick={() => {
          setSelectedHotel(null); 
          setShowHotelForm(true);
          console.log("Button clicked");
        }} 
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
      >
        Add New Hotel
      </button>

      {/* Hotel Table */}
      <HotelTable 
        hotels={hotels} 
        setShowHotelForm={setShowHotelForm} 
        setSelectedHotel={setSelectedHotel} 
        fetchHotels={fetchHotels} 
      />
      
      {/* Hotel Form (Popup) */}
      {showHotelForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto"> 
            <HotelForm 
              hotelData={selectedHotel} 
              onClose={() => {
                setShowHotelForm(false);
                setSelectedHotel(null);
              }} 
              fetchHotels={fetchHotels} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
