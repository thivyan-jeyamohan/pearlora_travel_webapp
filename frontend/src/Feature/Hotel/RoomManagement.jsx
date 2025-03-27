import React, { useState, useEffect } from 'react';
import RoomTable from './RoomTable';
import RoomForm from './RoomForm';
import API from './services/api';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchHotels(); // Fetch hotels for the RoomForm select
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await API.get('/rooms'); // Fetch all rooms (you can filter by hotelId if needed)
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await API.get('/hotels'); // Fetch all hotels
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Room Management</h1>

      <button
        onClick={() => {
          setSelectedRoom(null);
          setShowRoomForm(true);
        }}
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
      >
        Add New Room
      </button>

      <RoomTable
        rooms={rooms}
        setShowRoomForm={setShowRoomForm}
        setSelectedRoom={setSelectedRoom}
        fetchRooms={fetchRooms}
        hotels={hotels} // Pass hotels to RoomTable
      />

      {showRoomForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"> 
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto"> 
            <RoomForm
              roomData={selectedRoom}
              onClose={() => {
                setShowRoomForm(false);
                setSelectedRoom(null);
              }}
              fetchRooms={fetchRooms}
              hotels={hotels}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;