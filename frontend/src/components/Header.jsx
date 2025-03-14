import React, { useState, useRef, useEffect } from 'react';
import profileAvatar from '../assets/profile-avatar.png';
import logo from '../assets/logo.png';
import '../App.css';
import { Link } from 'react-router-dom';
import SimpleDropdown from './SimpleDropDown';
import ProfileDropdown from './ProfileDropDown';

function Header() {

    return (

        <nav className="bg-white py-5 shadow-lg shadow-gray-500/50 font-bold pl-10 pr-10 ">
            <div className="container mx-auto flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center ">
                        <img src={logo} alt="Goyto Logo" className="h-8 mr-2" />
                        <span className="text-xl font-bold font-poppins">PEARLORA</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-6 gap-10">
                    <Link to="/" className="hover:text-gray-700 font-poppins ">
                        Home 
                    </Link>

                    <SimpleDropdown />

                    <Link to="/destination" className="hover:text-gray-700 font-poppins">About Us</Link>   
                </div>


                {/* "Let's Talk" Button, Profile Avatar & Search */}
                <div className="flex items-center gap-10">
                    
                    <ProfileDropdown />

                  <button className="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-full flex items-center font-poppins">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8a1 1 0 012 0v2a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v2a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                        Let's Talk
                    </button>

                    
                </div>

                
            </div>
        </nav>
    );
}

export default Header;
