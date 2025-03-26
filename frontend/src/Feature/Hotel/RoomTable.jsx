import React from 'react';
import API from './services/api';

const RoomTable = ({ rooms, setShowRoomForm, setSelectedRoom, fetchRooms, hotels }) => {

    const getHotelName = (hotelId) => {
        const hotel = hotels.find(h => h._id === hotelId);
        return hotel ? hotel.name : "Unknown Hotel";
    };


    const handleEdit = (room) => {
        setSelectedRoom(room);
        setShowRoomForm(true);
    };

    const handleDelete = async (roomId) => {
        try {
            await API.delete(`/rooms/${roomId}`);
            fetchRooms();
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    return (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Room ID</th>
                        <th className="border p-2">Hotel Name</th>
                        <th className="border p-2">Room Number</th>
                        <th className="border p-2">Photo</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Room Category</th>
                        <th className="border p-2">Room Status</th>
                        {/* <th className="border p-2">Bed Type</th> */}
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room._id}>
                            <td className="border p-2">{room._id}</td>
                            <td className="border p-2">{getHotelName(room.hotelId)}</td>
                            <td className="border p-2">{room.roomNumber}</td>
                            <td className="border p-2">
                                <img src={room.photo} alt="Room" className="w-16 h-16 object-cover" />
                            </td>
                            <td className="border p-2">{room.price}</td>
                            <td className="border p-2">{room.roomCategory}</td>
                            <td className="border p-2">{room.isBooked ? "Booked" : "Available"}</td>
                            {/* <td className="border p-2">{room.bedType}</td> */}
                            <td className="border p-2">
                                <button onClick={() => handleEdit(room)} className="p-2 bg-yellow-500 text-white mr-2">Edit</button>
                                <button onClick={() => handleDelete(room._id)} className="p-2 bg-red-500 text-white">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoomTable;