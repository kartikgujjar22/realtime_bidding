const express = require("express");
const {
  createAuction,
  getAllAuctions,
  getAuctionById,
} = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAuction);
router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);

module.exports = router;
