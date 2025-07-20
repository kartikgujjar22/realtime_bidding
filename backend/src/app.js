const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file in the backend root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import auth routes
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const auctionRoutes = require("./routes/auctions");

// Example route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Realtime Bidding API!" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auctions", auctionRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("App error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
