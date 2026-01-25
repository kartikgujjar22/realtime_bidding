import Cookies from "js-cookie";
import { isTokenExpired } from "../utils/jwtUtils";

/**
 * Custom fetch wrapper that handles authentication and automatic logout on 401
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {function} onUnauthorized - Callback function to call on 401 response (usually logout)
 * @returns {Promise<Response>} Fetch response
 */
export const authenticatedFetch = async (url, options = {}, onUnauthorized = null) => {
    const token = Cookies.get("token");

    // Check if token exists and is not expired before making request
    if (token && isTokenExpired(token)) {
        console.log("Token expired before API call, triggering logout...");
        if (onUnauthorized) {
            onUnauthorized();
        }
        throw new Error("Token expired");
    }

    // Merge authorization header with existing headers
    const headers = {
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Make the fetch request
    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
        console.log("Received 401 Unauthorized from server, triggering logout...");
        if (onUnauthorized) {
            onUnauthorized();
        }
        throw new Error("Unauthorized - token may be expired or invalid");
    }

    return response;
};

/**
 * Create a configured fetch function with logout callback
 * @param {function} logoutCallback - Function to call when unauthorized
 * @returns {function} Configured fetch function
 */
export const createAuthenticatedFetch = (logoutCallback) => {
    return (url, options = {}) => authenticatedFetch(url, options, logoutCallback);
};
