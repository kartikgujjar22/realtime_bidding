const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const dotenv = require("dotenv");
const logger = require("../../logger");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

//helper function to generate JWT
const generateToken = (id) => {
  logger.info("Generating JWT token");
  logger.info("This is the JWT SECRET USED:", process.env.JWT_SECRET);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    logger.info("Checking existing user...");
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    logger.info("Hashing password...");
    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password, salt);
    logger.info("Creating new user...");
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    logger.info("User registered successfully:", newUser.id);
    res.status(201).json({
      message: "User registered successfully",
      id: newUser.id,
      Username: newUser.name,
      token: generateToken(newUser.id),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    logger.info("Finding user for login...");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    logger.info("Comparing passwords...");
    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    logger.info("Login successful for user:", user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: "Login successful",
      id: user.id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

const logoutUser = (req, res) => {
  // Clear the cookie by setting it to expire immediately
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

exports = module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
