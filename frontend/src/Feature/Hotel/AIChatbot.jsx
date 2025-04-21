// src/pages/Hotel/AIChatbot.js (or wherever you place it)
import React, { useState, useRef, useEffect } from 'react';
import API from './services/api'; // Ensure this path is correct
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Using react-icons

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you with The Pearl Hotel Booking today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // State to hold error messages
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll whenever messages change or loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (isOpen) setError(''); // Clear error when closing
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading) return;

        setError(''); // Clear previous errors
        const newUserMessage = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        // Prepare limited history for context
        const historyForAPI = messages.slice(-6).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        try {
            const response = await API.post('/chatbot/query', {
                message: userMessage,
                // Send history in the format OpenAI expects if the backend doesn't transform it
                // history: historyForAPI // Assuming backend handles structure
                history: messages.slice(-6) // Send raw history, backend controller needs to map it
            });

            setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
        } catch (err) {
            console.error("Error sending message:", err);
            const errorText = err.response?.data?.message || "Sorry, I couldn't connect. Please try again.";
            setError(errorText); // Set error state to display below input
            // Optionally add an error message bubble in the chat
            // setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${errorText}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Bubble Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-5 right-5 z-50 ${isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ease-in-out`}
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 z-40 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center shadow">
                        <h3 className="font-semibold text-lg">Chat Assistant</h3>
                        <button onClick={toggleChat} className="text-white opacity-80 hover:opacity-100">
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                    {/* Basic Markdown-like formatting can be added here if needed */}
                                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
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
                        {/* Empty div to ensure scrolling to bottom works */}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Display Error Below Input */}
                    {error && (
                       <div className="px-3 pt-1 text-red-600 text-xs text-center">
                           {error}
                       </div>
                    )}

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex items-center bg-white">
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