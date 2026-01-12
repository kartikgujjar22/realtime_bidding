const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");
const { protect } = require("../middleware/authMiddleware");
const { uploadImage } = require("../middleware/uploadMiddleware");

router.get("/", auctionController.getAllAuctions);

router.get("/:id", auctionController.getAuctionById);

router.post("/", protect, uploadImage, auctionController.createAuction);

module.exports = router;
