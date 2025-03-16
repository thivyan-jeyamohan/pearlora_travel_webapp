import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileAvatar from '../assets/profile-avatar.png';

function ProfileDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setOpen(!open);
    const closeDropdown = () => setOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isLoggedIn = true;
    const userAvatar = profileAvatar;

    return (
        <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
                <>
                    <button onClick={toggleDropdown} className="focus:outline-none">
                        <img src={userAvatar} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                    </button>
                    {open && (
                        <div className="absolute right-0 mt-2 w-48 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-lg z-50">
                            <Link 
                                to="/transport-dashboard" 
                                onClick={closeDropdown} 
                                className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/profile" 
                                onClick={closeDropdown} 
                                className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                            >
                                Financial
                            </Link>
                            <Link 
                                to="/signup" 
                                onClick={closeDropdown} 
                                className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                            >
                                Sign Out
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <Link 
                    to="/destination" 
                    className="ml-4 text-violet-700 hover:text-violet-800 font-bold font-poppins"
                >
                    Sign In
                </Link>
            )}
        </div>
    );
}

export default ProfileDropdown;
