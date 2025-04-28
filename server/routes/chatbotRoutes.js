import express from 'express';
import { handleChatQuery } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/query', handleChatQuery); 

export default router;




// import express from 'express';
// import { handleChatQuery } from '../controllers/chatbotController.js';

// const router = express.Router();

// router.post('/query', handleChatQuery);

// export default router;