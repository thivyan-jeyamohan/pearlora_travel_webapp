import { SessionsClient } from '@google-cloud/dialogflow';
import path from 'path'; 
import { fileURLToPath } from 'url'; 



const projectId =process.env.DIALOGFLOW_PROJECT_ID; 
const languageCode = 'en';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFilePath = path.resolve(__dirname, '../config/dialogflow-key.json'); 


if (!projectId) {
    console.error("FATAL ERROR: DIALOGFLOW_PROJECT_ID environment variable is not set.");
}

let sessionsClient;
try {
    
    sessionsClient = new SessionsClient({
        projectId: projectId, 
        keyFilename: keyFilePath 
    });
    
    console.log(`[ChatbotController] Dialogflow SessionsClient initialized using keyfile: ${keyFilePath}`);
} catch (error) {
    console.error(`FATAL ERROR: Failed to initialize Dialogflow SessionsClient with keyfile "${keyFilePath}". Check path and file validity.`, error);
    sessionsClient = null;
}

// --- Controller Function  ---
export const handleChatQuery = async (req, res) => {
    if (!sessionsClient) {
       console.error("handleChatQuery Error: SessionsClient not initialized.");
       return res.status(500).json({ message: "Chat service is not available (Initialization Failed)." });
    }

    const { message, sessionId } = req.body;

    

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }
    if (!projectId) {
        return res.status(500).json({ message: "Chat service configuration error (Project ID missing)." });
    }

    let sessionPath;
     try {
         sessionPath = sessionsClient.projectAgentSessionPath(projectId, sessionId);
     } catch(error) {
         console.error("Error creating session path:", { projectId, sessionId, error });
         return res.status(400).json({ message: "Invalid session ID format provided." });
     }

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: languageCode,
            },
        },
    };

    console.log(`--> Sending to Dialogflow [Session: ${sessionId}]: "${message}"`);

    try {
        const responses = await sessionsClient.detectIntent(request);
        console.log(`<-- Dialogflow Response Received for Session: ${sessionId}`);

        const result = responses[0].queryResult;

        if (!result) {
            console.error(`Dialogflow returned no queryResult for Session ${sessionId}:`, responses);
            return res.status(500).json({ message: "Received an empty result from the chat service." });
        }

        const botResponse = result.fulfillmentText || "Sorry, I didn't quite understand that. Can you please rephrase?";

        console.log(`  Response for Session ${sessionId}: "${botResponse}"`);
        if (result.intent) {
            console.log(`  Intent Matched: ${result.intent.displayName}`);
        } else {
            console.log(`  No Intent Matched (Fallback)`);
        }

        res.status(200).json({ reply: botResponse });

    } catch (error) {
        console.error(`Error calling Dialogflow detectIntent API for Session ${sessionId}:`, error);
        res.status(500).json({ message: "Error processing your chat request." });
    }
};