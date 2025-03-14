import express from "express";
import Transport from "../models/Transport.js";

const router = express.Router();

// 📌 Get transport options
router.get("/", async (req, res) => {
  const transports = await Transport.find(); // Fetch transport options from DB
  res.json(transports);
});

export default router;
