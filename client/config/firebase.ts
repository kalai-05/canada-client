import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjwzqt6c1dAl103YuwxkUy5zMJKh3AkSQ",
  authDomain: "mechainvoice.firebaseapp.com",
  projectId: "mechainvoice",
  storageBucket: "mechainvoice.firebasestorage.app",
  messagingSenderId: "149114786787",
  appId: "1:149114786787:web:cab2de59c45d724be786d6",
  measurementId: "G-3K87M6MVBE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
