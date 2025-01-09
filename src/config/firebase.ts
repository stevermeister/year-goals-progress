import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Replace these with your Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCzWdLptTiaw1W09YZB_4lTBd7qpgveDyI",
  authDomain: "year-goals-progress.firebaseapp.com",
  projectId: "year-goals-progress",
  storageBucket: "year-goals-progress.firebasestorage.app",
  messagingSenderId: "170568216399",
  appId: "1:170568216399:web:5f7ce6f3d0e4bad4e79f3a",
  measurementId: "G-KBMTKW24QG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Ensure we're using local persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Only initialize analytics in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
