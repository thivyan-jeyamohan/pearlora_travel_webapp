import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SimpleDropdown() {
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => setOpen(!open);
    const closeDropdown = () => setOpen(false);

    return (
        <div className="relative">
            <button 
                onClick={toggleDropdown} 
                className="hover:text-gray-700 font-poppins flex items-center"
            >
                Booking <span className="ml-1">▾</span>
            </button>

            {open && (
                <div 
                    className="absolute left-0 mt-2 w-48 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-lg z-50"
                >
                    <Link 
                        to="/destination" 
                        onClick={closeDropdown}
                        className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                    >
                        Destination
                    </Link>
                    <Link 
                        to="/transport" 
                        onClick={closeDropdown}
                        className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                    >
                        Transport
                    </Link>
                    <Link 
                        to="/hotel" 
                        onClick={closeDropdown}
                        className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                    >
                        Hotel
                    </Link>
                    <Link 
                        to="/event" 
                        onClick={closeDropdown}
                        className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                    >
                        Event
                    </Link>
                </div>
            )}
        </div>
    );
}

export default SimpleDropdown;
