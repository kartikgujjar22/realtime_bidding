// backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser"); // <--- FIX 4: Import this
const logger = require("../logger");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <--- FIX 4: Use this!

// Import routes
const authRoutes = require("./routes/auth");
// Comment these out if you haven't created these files yet to prevent crashes
// const uploadRoutes = require("./routes/upload");
// const auctionRoutes = require("./routes/auctions");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Realtime Bidding API!" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/auctions", auctionRoutes);

// Error handlers... (Keep your existing error handling code here)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
