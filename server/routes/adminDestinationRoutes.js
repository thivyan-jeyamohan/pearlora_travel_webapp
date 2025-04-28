import express from "express";
import multer from "multer";
import adminDestinationController from "../controllers/adminDestinationController.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Add a new destination
router.post("/add", upload.array("images", 5), adminDestinationController.addDestination);

// Get all destinations (with optional filter by status)
router.get("/", adminDestinationController.getDestinations);

// Toggle the status of a destination (Draft/Published)
router.put("/toggle-status/:id", adminDestinationController.toggleDestinationStatus);

// Search destinations based on location
router.get("/search", adminDestinationController.searchDestinations);

// Get a single destination by ID
router.get("/:id", adminDestinationController.getDestinationById);

// Update destination by ID
router.put("/update/:id", upload.array("images"), adminDestinationController.updateDestination);

// Delete destination by ID
router.delete("/delete/:id", adminDestinationController.deleteDestination);

// Delete image from a destination
router.post("/delete-image", adminDestinationController.deleteImage);

export default router;
