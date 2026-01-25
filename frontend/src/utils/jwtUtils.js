/**
 * JWT Token Utility Functions
 * Handles JWT token decoding and expiration checking
 */

/**
 * Decode a JWT token (without verification - client-side only)
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get token expiration time in milliseconds
 * @param {string} token - JWT token string
 * @returns {number|null} Expiration timestamp in milliseconds or null
 */
export const getTokenExpirationTime = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  
  // JWT exp is in seconds, convert to milliseconds
  return decoded.exp * 1000;
};

/**
 * Check if a token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return true; // Treat invalid tokens as expired
  
  const currentTime = Date.now();
  return currentTime >= expirationTime;
};

/**
 * Get time remaining until token expires (in milliseconds)
 * @param {string} token - JWT token string
 * @returns {number} Milliseconds until expiration (negative if already expired)
 */
export const getTimeUntilExpiration = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return -1;
  
  return expirationTime - Date.now();
};

/**
 * Setup a timer to execute callback when token expires
 * @param {string} token - JWT token string
 * @param {function} callback - Function to call when token expires
 * @returns {number|null} Timer ID that can be used with clearTimeout, or null
 */
export const setupTokenExpirationTimer = (token, callback) => {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  
  // If already expired, call immediately
  if (timeUntilExpiration <= 0) {
    callback();
    return null;
  }
  
  // Set timeout for when token expires
  // Add a small buffer (100ms) to ensure the token is definitely expired
  const timerId = setTimeout(callback, timeUntilExpiration + 100);
  
  return timerId;
};
