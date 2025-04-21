import OpenAI from 'openai';
import Hotel from '../models/Hotel.js'; // Needed for general hotel info

// --- Ensure OpenAI API Key is loaded ---
// if (!process.env.OPENAI_API_KEY) {
//     console.error("FATAL ERROR: OPENAI_API_KEY environment variable is not set.");
//     // Optionally exit or throw an error to prevent startup without the key
//     // process.exit(1);
// }
 

const MY_API_KEY="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"
const openai = new OpenAI({
    apiKey: MY_API_KEY,
});

// --- Cache for Hotel Names (Simple Example) ---
let cachedHotelInfo = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 1 * 60 * 60 * 1000; // Cache for 1 hour

const getHotelContextInfo = async () => {
    const now = Date.now();
    if (cachedHotelInfo && (now - cacheTimestamp < CACHE_DURATION_MS)) {
        return cachedHotelInfo;
    }
    try {
        console.log("Fetching hotel info for chatbot cache...");
        const hotels = await Hotel.find({}, 'name location rating description') // Get relevant fields
                                  .limit(20) // Limit the amount of data
                                  .lean(); // Use lean for faster read-only
        cachedHotelInfo = hotels.map(h => ({
            name: h.name,
            location: h.location,
            rating: h.rating,
            // Keep description short for context
            description: h.description.substring(0, 100) + (h.description.length > 100 ? '...' : '')
        }));
        cacheTimestamp = now;
        return cachedHotelInfo;
    } catch (error) {
        console.error("Error fetching hotel names for chatbot:", error);
        return []; // Return empty array on error, don't block chatbot
    }
};
// Initial fetch on startup (optional)
getHotelContextInfo();


export const handleChatQuery = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }
    if (!process.env.OPENAI_API_KEY) {
         return res.status(500).json({ message: "AI Service is not configured correctly." });
    }

    try {
        // --- Fetch Dynamic Context (Cached) ---
        const hotelContext = await getHotelContextInfo();
        let hotelSummary = "We have several great hotels.";
        if (hotelContext.length > 0) {
            // Provide a summary, not the full list unless necessary/prompted
            const locations = [...new Set(hotelContext.map(h => h.location))].join(', ');
            hotelSummary = `We have lovely hotels including locations like ${locations}. You can ask about specific hotel names if you like.`;
            // Example of adding more detail for the AI's internal knowledge:
            // hotelSummary += `\nKnown Hotels Overview:\n` + hotelContext.map(h => `- ${h.name} (${h.location}, ${h.rating}/5 stars)`).join('\n');
        }

        // --- Improved System Prompt ---
        const systemPrompt = `You are 'Pearl Assist', a friendly and helpful chatbot for "The Pearl Hotel Booking" website.
        Your primary goal is to answer user questions about our hotels and the booking process based *only* on the information provided here and general knowledge.
        **Key Information & Constraints:**
        *   **General Hotel Info:** ${hotelSummary} You can provide the brief description or rating if asked about a *specific* hotel mentioned in the overview.
        *   **Booking Process:** Users MUST use the website interface. Find the hotel, select dates, check availability, and then proceed to book. You CANNOT make bookings or modify existing ones.
        *   **Availability & Pricing:** Availability and exact prices depend on specific dates and room types. You CANNOT check real-time availability or prices. Instruct users: "To see available rooms and exact prices for your dates, please go to the hotel's page, select your check-in and check-out dates, and click 'Check Availability'."
        *   **Check-in/Check-out:** Standard check-in is usually after 2 PM, and check-out is before 11 AM. Mention this may vary slightly by hotel.
        *   **Policies:** Do not invent specific policies (pets, cancellation). If asked, state: "Specific policies like pet allowance or cancellation details can vary. It's best to check the hotel's details page or contact support for exact information."
        *   **Navigation:** Guide users (e.g., "Use the search bar or filters on the main page to find hotels.").
        *   **Conciseness:** Keep answers relatively brief and easy to understand.
        *   **Limitations:** If you don't know the answer or cannot perform the request (like booking), clearly state your limitation and guide the user appropriately (e.g., "I can't check live availability, but you can do so on the hotel page...").
        *   **Personality:** Be polite, helpful, and slightly professional.`;

        // --- Construct messages for OpenAI ---
        // Ensure history format is correct (role: 'user' or 'assistant')
        const conversationMessages = [
            { role: "system", content: systemPrompt },
            // Map provided history to the expected format
            ...history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant', // Map sender to role
                content: msg.text
            })),
            { role: "user", content: message } // Add the current user message
        ];

        // Limit message length if necessary (OpenAI has token limits)
        // Add logic here if total tokens might exceed limits

        // --- Call OpenAI API ---
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Cost-effective choice
            messages: conversationMessages,
            max_tokens: 150, // Limit response length
            temperature: 0.6, // Balance creativity and predictability
            n: 1, // Get one response
            // stop: ["\n"], // Optional: stop generation at certain points
        });

        const botResponse = completion.choices[0]?.message?.content?.trim();

        if (!botResponse) {
             console.error("OpenAI response was empty or malformed:", completion);
             throw new Error("AI service returned an empty response."); // Trigger generic error
        }

        res.status(200).json({ reply: botResponse });

    } catch (error) {
        console.error("Error handling chat query:", error);
        let errorMessage = "Sorry, I encountered an issue processing your request. Please try again later.";
        let statusCode = 500;

         if (error instanceof OpenAI.APIError) {
             console.error("OpenAI API Error Details:", { status: error.status, message: error.message, code: error.code, type: error.type });
             // Provide more specific feedback for certain OpenAI errors if desired
             if (error.status === 401) errorMessage = "AI Service Authentication failed. Please contact support.";
             else if (error.status === 429) errorMessage = "AI Service is currently busy. Please try again shortly.";
             else errorMessage = `AI Service Error: ${error.message}`; // Pass OpenAI message if safe
             statusCode = error.status || 500; // Use OpenAI status code if available
        } else if (error.message === "AI service returned an empty response.") {
            errorMessage = "Sorry, I couldn't generate a response for that. Could you try rephrasing?";
        }
        // Ensure status code is reasonable for client handling
        statusCode = statusCode < 600 ? statusCode : 500;

        res.status(statusCode).json({ message: errorMessage });
    }
};