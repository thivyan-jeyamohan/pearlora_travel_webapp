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
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await API.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await API.get('/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleAddRoomClick = () => {
    setSelectedRoom(null);
    setShowRoomForm(true);
  };

  const handleCloseForm = () => {
    setShowRoomForm(false);
    setSelectedRoom(null);
  };

  const handleRoomSaved = () => {
    fetchRooms();
    handleCloseForm();
  };

  const handleEditRoom = (room) => {  
    setSelectedRoom(room);
    setShowRoomForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">Room Management</h1>
        {!showRoomForm && (
          <button
            onClick={handleAddRoomClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Room
          </button>
        )}
      </div>

      {showRoomForm ? (
        <RoomForm
          roomData={selectedRoom}
          onClose={handleCloseForm}
          fetchRooms={fetchRooms}
          hotels={hotels}
          onRoomSaved={handleRoomSaved}
        />
      ) : (
        <RoomTable
          rooms={rooms}
          fetchRooms={fetchRooms}
          hotels={hotels}
          onEdit={handleEditRoom}  
        />
      )}
    </div>
  );
};

export default RoomManagement;