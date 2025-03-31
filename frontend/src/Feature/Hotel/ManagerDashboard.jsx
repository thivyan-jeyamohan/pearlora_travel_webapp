import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHotel, faBed, faClipboardList, faChartBar } from '@fortawesome/free-solid-svg-icons';
import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import Overview from './Overview';
import HotelDetail from "./HotelDetail";
import Reports from './Reports'; 

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [fetchBookingsFromDashboard, setFetchBookingsFromDashboard] = useState(null);

  const handleFetchBookingsCallback = useCallback((fetchBookings) => {
    setFetchBookingsFromDashboard(() => fetchBookings);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 mt-20">
      {/* Sidebar */}
      <div className="w-64 text-white h-screen fixed left-0 top-0 p-6 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg mt-18">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Manager Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer ${activeSection === 'overview' ? 'bg-gray-500' : ''}`}
              aria-label="Overview"
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('hotelManagement')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer ${activeSection === 'hotelManagement' ? 'bg-gray-500' : ''}`}
              aria-label="Hotel Management"
            >
              <FontAwesomeIcon icon={faHotel} className="mr-3" />
              Hotel Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('roomManagement')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer ${activeSection === 'roomManagement' ? 'bg-gray-500' : ''}`}
              aria-label="Room Management"
            >
              <FontAwesomeIcon icon={faBed} className="mr-3" />
              Room Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('bookingManagement')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer ${activeSection === 'bookingManagement' ? 'bg-gray-500' : ''}`}
              aria-label="Booking Management"
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
              Booking Management
            </button>
          </li>
           <li>
            <button
              onClick={() => setActiveSection('reports')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer ${activeSection === 'reports' ? 'bg-gray-500' : ''}`}
              aria-label="Reports"
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-3" />
              Reports
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-y-auto p-6 h-screen">
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeSection === 'overview' && <Overview />}
          {activeSection === 'hotelManagement' && <HotelManagement />}
          {activeSection === 'roomManagement' && <RoomManagement />}
          {activeSection === 'bookingManagement' && (
            <BookingManagement setFetchBookingsFromDashboard={handleFetchBookingsCallback} />
          )}
           {activeSection === 'reports' && <Reports />}
          {activeSection === 'hotel' && fetchBookingsFromDashboard && (
            <HotelDetail fetchBookings={fetchBookingsFromDashboard} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;