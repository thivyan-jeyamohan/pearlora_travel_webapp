import fetch from 'node-fetch'; 
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();


const HUGGING_FACE_API_KEY = "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";
const MODEL_ID = "google/flan-t5-base"; 
const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contextFilePath = path.resolve(__dirname, '../config/booking_context.txt');


let bookingContext = '';
fs.readFile(contextFilePath, 'utf8')
  .then(data => {
    bookingContext = data;
    console.log(`[ChatbotController] Booking context loaded successfully.`);
  })
  .catch(err => {
    console.error(`FATAL ERROR: Could not read booking context file at "${contextFilePath}".`, err);
  });

if (!HUGGING_FACE_API_KEY) {
    console.error("FATAL ERROR: HUGGINGFACE_API_TOKEN environment variable is not set.");
}


const GREETINGS = new Set(['hi', 'hello', 'hey', 'heya', 'yo', 'greetings']);
const GOODBYES = new Set(['bye', 'goodbye', 'see you', 'farewell', 'thanks', 'thank you', 'ok thanks', 'thanks bye']);


export const handleChatQuery = async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }
    
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }
    if (!HUGGING_FACE_API_KEY) {
        console.error("handleChatQuery Error: API Key missing.");
        return res.status(500).json({ message: "Chat service configuration error." });
    }
    if (!bookingContext) {
         console.error("handleChatQuery Error: Booking context not loaded.");
         return res.status(500).json({ message: "Chat service context is unavailable." });
    }

    const lowerCaseMessage = message.trim().toLowerCase();

    
    if (GREETINGS.has(lowerCaseMessage)) {
        console.log(`--> Handling Greeting [Session: ${sessionId}]`);
        return res.status(200).json({ reply: "Hello there! How can I help you with the Pearl Hotel booking process today?" });
    }

    if (GOODBYES.has(lowerCaseMessage)) {
        console.log(`--> Handling Goodbye [Session: ${sessionId}]`);
        return res.status(200).json({ reply: "You're welcome! Have a great day. Goodbye!" });
    }
    
    const prompt = `Context: """${bookingContext}""" \n\nBased strictly on the provided context about the Pearl Hotel Booking website, answer the following question accurately and concisely. If the answer cannot be found in the context, state that you don't have that specific information from the provided details.\n\nQuestion: "${message}"\n\nAnswer:`;

    console.log(`--> Sending Prompt to Hugging Face [Session: ${sessionId}]: Question: "${message}"`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    min_new_tokens: 30,
                    max_new_tokens: 150,
                    temperature: 0.7,
                    // return_full_text: false, 
                    num_return_sequences: 1,
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Hugging Face API Error (${response.status}): ${errorBody}`);
            
             if (errorBody.includes("currently loading")) {
                 return res.status(503).json({ reply: "The chatbot model is currently loading, please try again in a moment." });
             }
             if (response.status === 400 && errorBody.includes("is longer than the specified maximum sequence length")) {
                  return res.status(400).json({ reply: "Sorry, your message combined with the context was too long for me to process. Could you ask a shorter question?" });
             }
            throw new Error(`Chat service failed (Status: ${response.status}).`);
        }

        const results = await response.json();
        const botResponse = results[0]?.generated_text?.trim() || "Sorry, I had trouble generating a response. Please try rephrasing.";


        let finalResponse = botResponse;
        const genericFallbacks = [
            "i don't have that specific information",
            "i cannot answer that based on the provided context",
            "the context does not contain information",
            "based on the text provided, i cannot answer",
            "i don't have that information from the provided details"
            
        ];

       
        if (genericFallbacks.some(fb => finalResponse.toLowerCase().includes(fb))) {
             console.log(`  Using custom fallback instead of model's fallback.`);
             finalResponse = "Sorry, I couldn't find specific details about that in the booking process information I have. You might need to contact support for more specific queries.";
        }


        console.log(`<-- Hugging Face Response Received [Session: ${sessionId}]: "${finalResponse}"`);
        res.status(200).json({ reply: finalResponse });

    } catch (error) {
        console.error(`Error calling Hugging Face API for Session ${sessionId}:`, error);
        res.status(500).json({ message: error.message || "Error processing your chat request." });
    }
};






// import { SessionsClient } from '@google-cloud/dialogflow';
// import path from 'path'; 
// import { fileURLToPath } from 'url'; 



// const projectId ="pearlhotelbot-ndrp"; 
// const languageCode = 'en';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const keyFilePath = path.resolve(__dirname, '../config/dialogflow-key.json'); 


// if (!projectId) {
//     console.error("FATAL ERROR: DIALOGFLOW_PROJECT_ID environment variable is not set.");
// }

// let sessionsClient;
// try {
    
//     sessionsClient = new SessionsClient({
//         projectId: projectId, 
//         keyFilename: keyFilePath 
//     });
    
//     console.log(`[ChatbotController] Dialogflow SessionsClient initialized using keyfile: ${keyFilePath}`);
// } catch (error) {
//     console.error(`FATAL ERROR: Failed to initialize Dialogflow SessionsClient with keyfile "${keyFilePath}". Check path and file validity.`, error);
//     sessionsClient = null;
// }

// // --- Controller Function  ---
// export const handleChatQuery = async (req, res) => {
//     if (!sessionsClient) {
//        console.error("handleChatQuery Error: SessionsClient not initialized.");
//        return res.status(500).json({ message: "Chat service is not available (Initialization Failed)." });
//     }

//     const { message, sessionId } = req.body;

    

//     if (!message) {
//         return res.status(400).json({ message: "Message is required" });
//     }
//     if (!sessionId) {
//         return res.status(400).json({ message: "Session ID is required" });
//     }
//     if (!projectId) {
//         return res.status(500).json({ message: "Chat service configuration error (Project ID missing)." });
//     }

//     let sessionPath;
//      try {
//          sessionPath = sessionsClient.projectAgentSessionPath(projectId, sessionId);
//      } catch(error) {
//          console.error("Error creating session path:", { projectId, sessionId, error });
//          return res.status(400).json({ message: "Invalid session ID format provided." });
//      }

//     const request = {
//         session: sessionPath,
//         queryInput: {
//             text: {
//                 text: message,
//                 languageCode: languageCode,
//             },
//         },
//     };

//     console.log(`--> Sending to Dialogflow [Session: ${sessionId}]: "${message}"`);

//     try {
//         const responses = await sessionsClient.detectIntent(request);
//         console.log(`<-- Dialogflow Response Received for Session: ${sessionId}`);

//         const result = responses[0].queryResult;

//         if (!result) {
//             console.error(`Dialogflow returned no queryResult for Session ${sessionId}:`, responses);
//             return res.status(500).json({ message: "Received an empty result from the chat service." });
//         }

//         const botResponse = result.fulfillmentText || "Sorry, I didn't quite understand that. Can you please rephrase?";

//         console.log(`  Response for Session ${sessionId}: "${botResponse}"`);
//         if (result.intent) {
//             console.log(`  Intent Matched: ${result.intent.displayName}`);
//         } else {
//             console.log(`  No Intent Matched (Fallback)`);
//         }

//         res.status(200).json({ reply: botResponse });

//     } catch (error) {
//         console.error(`Error calling Dialogflow detectIntent API for Session ${sessionId}:`, error);
//         res.status(500).json({ message: "Error processing your chat request." });
//     }
// };