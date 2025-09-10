// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNeSFmYV5cI3WW6N8ZIF9J6HJDHwqCOyU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecowatch-470604.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecowatch-470604",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecowatch-470604.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "732511249252",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:732511249252:web:53a7923f0137d73e20d071"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
