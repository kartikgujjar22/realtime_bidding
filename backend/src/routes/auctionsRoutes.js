const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  auctionController.createAuction
);

module.exports = router;
