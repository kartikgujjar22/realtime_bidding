// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const protect = async (req, res, next) => {
  let token;

  // 1. Check Cookies (Web Browser Strategy)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Header
  // If a header exists, it overrides the cookie (useful for testing)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. Verify whatever token we found
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, wallet_balance: true }, // Don't return password
    });

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};

module.exports = { protect };
