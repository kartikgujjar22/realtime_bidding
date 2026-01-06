const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

// Configure Multer to store file in memory temporarily
// We don't save to disk because we are sending straight to Supabase
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// POST /api/auctions
// 1. Check Auth
// 2. Process File ('image' is the field name coming from frontend)
// 3. Run Controller
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  auctionController.createAuction
);

module.exports = router;
