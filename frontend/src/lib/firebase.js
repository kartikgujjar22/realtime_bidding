import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLRDY2KbOT_RpqoEa8GbiZGXJ7LCK0NQ0",
  authDomain: "realtime-bidding-a07c4.firebaseapp.com",
  projectId: "realtime-bidding-a07c4",
  storageBucket: "realtime-bidding-a07c4.firebasestorage.app",
  messagingSenderId: "133704921731",
  appId: "1:133704921731:web:b0835e285825b5916521b6",
  measurementId: "G-0RLGZK2ZVX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
