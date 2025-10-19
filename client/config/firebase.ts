import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIqOO55mmaAP2fuwN5gIv11s6cJ6XdvVg",
  authDomain: "workorderform-bd5d1.firebaseapp.com",
  projectId: "workorderform-bd5d1",
  storageBucket: "workorderform-bd5d1.firebasestorage.app",
  messagingSenderId: "856250330633",
  appId: "1:856250330633:web:278e3c11e42cc14c5112d8",
  measurementId: "G-HBM4D5V6W0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
