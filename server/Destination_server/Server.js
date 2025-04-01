require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const bookingRoutes = require("./routes/bookingRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const adminDestinationRoutes = require("./routes/adminDestinationRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve static files (Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api", destinationRoutes);
app.use("/api/admin-destinations", adminDestinationRoutes);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
