import React, { useState, useRef, useEffect } from 'react';
import API from './services/api';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you with The Pearl Hotel Booking today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sessionId, setSessionId] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        if (isOpen) {
             const timer = setTimeout(scrollToBottom, 100);
             return () => clearTimeout(timer);
        }
    }, [messages, isLoading, isOpen]);

    const toggleChat = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);
        if (isOpen) {
            setError('');
        } else if (!sessionId) {
             
             setSessionId(uuidv4());
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading || !sessionId) {
            return;
        }

        setError('');
        const newUserMessage = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await API.post('/chatbot/query', {
                message: userMessage,
                sessionId: sessionId
            });
            setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
        } catch (err) {
            console.error("Error sending message via API:", err);
            const errorText = err.response?.data?.message || "Sorry, connection error. Please try again.";
            setError(errorText);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className={`fixed bottom-5 right-5 z-50 ${isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ease-in-out`}
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center shadow">
                        <h3 className="font-semibold text-lg">Chat Assistant</h3>
                        <button onClick={toggleChat} className="text-white opacity-80 hover:opacity-100">
                            <FaTimes size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={`${msg.sender}-${index}-${Math.random()}`} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                    {typeof msg.text === 'string' ? msg.text.split('\n').map((line, i) => (
                                         <p key={i} className={line === '' ? 'h-4' : ''}>{line || '\u00A0'}</p> 
                                    )) : <p>{String(msg.text)}</p> }
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-500 p-3 rounded-lg italic shadow-sm rounded-bl-none">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {error && (
                       <div className="px-3 pt-1 text-red-600 text-xs text-center border-t border-gray-200">
                           {error}
                       </div>
                    )}

                    <form onSubmit={handleSendMessage} className={`border-t ${error ? 'border-gray-200' : 'border-gray-300'} p-3 flex items-center bg-white`}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Ask about hotels or booking..."
                            className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            disabled={isLoading}
                            aria-label="Chat input"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isLoading || !inputValue.trim()}
                            aria-label="Send message"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChatbot;