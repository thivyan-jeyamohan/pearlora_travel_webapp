const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");
const multer = require("multer");
const path = require("path");

// Ensure 'uploads' folder exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// ✅ Add a new destination (with image upload)
router.post("/add", upload.single("image"), destinationController.addDestination);

// ✅ Get all destinations
router.get("/all", destinationController.getDestinations);

module.exports = router;
