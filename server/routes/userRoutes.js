import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For user authentication

const router = express.Router();

// 📌 User Registration Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  await newUser.save(); // Save user to the database
  res.json({ message: "User registered successfully" });
});

// 📌 User Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  // Generate JWT token for authentication
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

export default router;
