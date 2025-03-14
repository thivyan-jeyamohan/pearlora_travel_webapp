import Transport from "../models/Transport.js";

// 📌 Get transport options
export const getTransportOptions = async (req, res) => {
  const transports = await Transport.find();
  res.json(transports);
};
