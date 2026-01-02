const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const logger = require("../logger");

// Load environment variables from .env file in the backend root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 5000;

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
  logger.info("Root route accessed");
  res.json({ message: "Welcome to the Realtime Bidding API!" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auctions", auctionRoutes);

// 404 handler
app.use((req, res, next) => {
  logger.error(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("App error:", err);
  logger.error(`Internal Server Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
