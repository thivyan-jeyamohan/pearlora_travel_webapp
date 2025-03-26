import React, { useState, useEffect } from 'react';
import API from './services/api';

const RoomForm = ({ onClose, fetchRooms, roomData = null, hotels }) => {
    const [hotelId, setHotelId] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [photo, setPhoto] = useState('');
    const [price, setPrice] = useState('');
    const [roomCategory, setRoomCategory] = useState('Single');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (roomData) {
            setHotelId(roomData.hotelId || '');
            setRoomNumber(roomData.roomNumber || '');
            setPhoto(roomData.photo || '');
            setPrice(roomData.price || '');
            setRoomCategory(roomData.roomCategory || 'Single');
    
        } else {
            setHotelId('');
            setRoomNumber('');
            setPhoto('');
            setPrice('');
            setRoomCategory('Single');

        }
    }, [roomData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result); // Base64 encoded image
            setUploading(false);
        };
        reader.onerror = () => {
            console.error("Error reading file");
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting room data:", {
            hotelId,
            roomNumber,
            photo,
            price: parseFloat(price),
            roomCategory,
        });
    
        const roomDataToSubmit = {
          hotelId,
          roomNumber,
          photo,
          price: parseFloat(price),
          roomCategory,
        };
    
        try {
          if (roomData?._id) {
            await API.put(`/rooms/${roomData._id}`, roomDataToSubmit);
          } else {
            await API.post('/rooms', roomDataToSubmit);
          }
           await fetchRooms();
          onClose();
        } catch (error) {
          console.error('Error saving room:', error);
          console.log('Full AxiosError:', error);  // Add this
          onClose();
        }
      };


    return (
        <div className="p-4 bg-white border shadow-md rounded-lg">
            <h3 className="text-xl mb-4 font-semibold">{roomData ? 'Edit Room' : 'Add New Room'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Hotel</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={hotelId}
                        onChange={(e) => setHotelId(e.target.value)}
                        required
                    >
                        <option value="">Select a Hotel</option>
                        {hotels.map(hotel => (
                            <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Room Number</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Photo</label>
                    <input
                        type="file"
                        className="w-full p-2 border rounded-md"
                        onChange={handleImageUpload}
                    />
                    {uploading && <p>Uploading...</p>}
                    {photo && (
                        <img src={photo} alt="Room" className="w-32 h-32 object-cover rounded-md mt-2" />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Price</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                {/* Room Category Select */}
                <div className="mb-4">
                    <label className="block mb-2">Room Category</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={roomCategory}
                        onChange={(e) => setRoomCategory(e.target.value)}
                        required
                    >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button type="submit" className="p-2 bg-green-500 text-white rounded-lg">Save</button>
                    <button type="button" onClick={onClose} className="p-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default RoomForm;