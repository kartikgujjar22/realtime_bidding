// backend/src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const path = require("path");
const logger = require("../../logger");
const Joi = require("joi");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const tokenExpiry = process.env.JWT_TOKEN_EXPIRES_IN || "1d";
logger.info(`JWT Token Expiry set to: ${tokenExpiry}`);
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: tokenExpiry,
  });
};

const registerUser = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, email, password } = req.body;

  try {
    logger.info("Checking if user exists or not");
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logger.info("User already exists");
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
      },
    });
    logger.info("User registered successfully", {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    // Send token in cookie immediately upon registration
    const token = generateToken(newUser.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
    });

    logger.info("Token generated and cookie set for new user", {
      userId: newUser.id,
    });

    res.status(201).json({
      message: "User registered successfully",
      id: newUser.id,
      username: newUser.username,
      token: token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  logger.info("Validating login request body");
  const { error } = schema.validate(req.body);
  if (error) {
    logger.info("Login validation failed", { error: error.details[0].message });
    return res.status(400).json({ error: error.details[0].message });
  }
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.info("User not found during login", { email });
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    logger.info("Password comparison result", { isMatch });
    if (!isMatch) {
      logger.info("Invalid password attempt", { email });
      return res.status(400).json({ error: "Invalid credentials" });
    }

    logger.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
    });
    const token = generateToken(user.id);
    logger.info("Token generated for logged in user", { userId: user.id });

    // Set token in HTTP-only cookie

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
    });
    logger.info("Token cookie set for logged in user", { userId: user.id });

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
