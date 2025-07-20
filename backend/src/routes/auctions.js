const express = require("express");
const { createAuction } = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAuction);

module.exports = router;
