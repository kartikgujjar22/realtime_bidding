const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let firebaseApp;

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Use the service account file directly
      const serviceAccountPath = path.resolve(
        __dirname,
        "../../realtime-bidding-a07c4-firebase-adminsdk-fbsvc-61abfa53b3.json"
      );

      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(
          `Service account file not found at: ${serviceAccountPath}`
        );
      }

      const serviceAccount = require(serviceAccountPath);

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "realtime-bidding-a07c4.appspot.com",
      });

      console.log("Firebase Admin SDK initialized successfully");
    } else {
      firebaseApp = admin.app();
      console.log("Firebase Admin SDK already initialized");
    }

    return firebaseApp;
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
};

// Initialize Firebase
const app = initializeFirebase();

// Get Firebase services
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Helper functions
const verifyToken = async (idToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

const getUserById = async (uid) => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

const createUserDocument = async (uid, userData) => {
  try {
    await db
      .collection("users")
      .doc(uid)
      .set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

module.exports = {
  db,
  auth,
  storage,
  app,
  verifyToken,
  getUserById,
  createUserDocument,
};
