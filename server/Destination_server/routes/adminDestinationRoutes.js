const express = require("express");
const multer = require("multer");
const router = express.Router();
const adminDestinationController = require("../controllers/adminDestinationController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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
router.get("/search", (req, res, next) => {
  console.log("Hit /search route with query:", req.query);
  adminDestinationController.searchDestinations(req, res, next);
});

// Get a single destination by ID
router.get("/:id", (req, res, next) => {
  console.log("Hit /:id route with id:", req.params.id);
  adminDestinationController.getDestinationById(req, res, next);
});

// Update destination by ID
router.put("/update/:id", upload.array("images"), adminDestinationController.updateDestination);

// Delete destination by ID
router.delete("/delete/:id", adminDestinationController.deleteDestination);

// Delete image from a destination
router.post("/delete-image", adminDestinationController.deleteImage);

module.exports = router;
