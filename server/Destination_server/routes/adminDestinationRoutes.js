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

router.post("/add", upload.array("images", 5), adminDestinationController.addDestination);
router.get("/", adminDestinationController.getDestinations);

// Debug: Log to confirm route hit
router.get("/search", (req, res, next) => {
  console.log("Hit /search route with query:", req.query);
  adminDestinationController.searchDestinations(req, res, next);
});
router.get("/:id", (req, res, next) => {
  console.log("Hit /:id route with id:", req.params.id);
  adminDestinationController.getDestinationById(req, res, next);
});

router.put("/update/:id", upload.array("images"), adminDestinationController.updateDestination);
router.delete("/delete/:id", adminDestinationController.deleteDestination);

module.exports = router;