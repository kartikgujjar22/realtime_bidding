// Test utility to generate an expired JWT token for testing
// This file is only for testing purposes
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Generate an expired token for testing
 * This creates a token that expired 1 hour ago
 */
const generateExpiredToken = (userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "-1h" } // Negative expiry means it's already expired
    );

    return token;
};

/**
 * Generate a token that expires in a few seconds (for testing)
 */
const generateShortLivedToken = (userId, seconds = 5) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: `${seconds}s` }
    );

    return token;
};

// Example usage - run this script to generate test tokens
if (require.main === module) {
    const testUserId = process.argv[2] || 1; // Default to user ID 1

    console.log("\n=== JWT Test Token Generator ===\n");

    console.log("1. Expired Token (expired 1 hour ago):");
    const expiredToken = generateExpiredToken(testUserId);
    console.log(expiredToken);
    console.log("\n");

    console.log("2. Short-lived Token (expires in 5 seconds):");
    const shortLivedToken = generateShortLivedToken(testUserId, 5);
    console.log(shortLivedToken);
    console.log("\n");

    console.log("Instructions for testing:");
    console.log("1. Copy one of the tokens above");
    console.log("2. Open your browser's DevTools (F12)");
    console.log("3. Go to Application > Cookies");
    console.log("4. Find the 'token' cookie and replace its value with the copied token");
    console.log("5. Refresh the page or perform an action to trigger the logout");
    console.log("\n");
}

module.exports = {
    generateExpiredToken,
    generateShortLivedToken,
};
