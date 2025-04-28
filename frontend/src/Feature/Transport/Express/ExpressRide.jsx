import React, { useState } from 'react';
import ExpressIntro from "./ExpressIntro";
import TravelList from "./TravelList";
import Footer from '../../../components/Footer';
import chatbot from '../../../assets/chatbot.gif';
import tripora from '../../../assets/tripora.png';

const ExpressRide = () => {
  const [filters, setFilters] = useState({
    departure: "",
    destination: "",
    date: "",
  });

  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Track visibility of the chatbot
  
    const toggleChatbot = () => {
      setIsChatbotOpen((prevState) => !prevState); // Toggle chatbot visibility
    };

  return (
    <>
      <ExpressIntro onFilterChange={setFilters} />
      <TravelList filters={filters} />
      <div className="mt-20"></div>
      <Footer />


    {/* Chatbot Help Button */}
          <div className="fixed bottom-5 right-5 z-50">
            <img
              src={chatbot}
              alt="Chatbot Help"
              className="w-25 h-25 mr-2 cursor-pointer"
              onClick={toggleChatbot} // Open/close the chatbot
            />
          </div>
    
          {/* Chatbot Frame */}
          {isChatbotOpen && (
            <div className="fixed bottom-10 right-10 w-96 h-150  border-gray-300 rounded-lg shadow-lg z-40">
              <div className="flex justify-between items-center p-3 bg-purple-900 text-white rounded-t-lg">
                <img src={tripora} className='h-10 w-35'  />
                <button
                  onClick={toggleChatbot}
                  className="text-xl font-semibold cursor-pointer"
                >
                  ×
                </button>
              </div>
              <iframe
                src="https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/23/08/20250423083634-C4MOB1LJ.json"
                title="Chatbot"
                width="100%"
                height="550px" 
                className="rounded-b-lg"
              />
            </div>
          )}


    </>
  );
};

export default ExpressRide;
