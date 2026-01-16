const express = require("express");
const router = express.Router();
const {
  depositFunds,
  getTransactions,
} = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");

// All wallet routes must be protected
router.post("/deposit", protect, depositFunds);
router.get("/history", protect, getTransactions);

module.exports = router;
