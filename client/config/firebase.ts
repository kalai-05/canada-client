import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration - using a demo/public config
// In production, use environment variables for sensitive data
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForAirsonicApp123456789",
  authDomain: "airsonic-work-manager.firebaseapp.com",
  projectId: "airsonic-work-manager",
  storageBucket: "airsonic-work-manager.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
