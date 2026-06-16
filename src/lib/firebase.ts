import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIUhZdmDT2nwjqAF715xrvZYr0uQ4HlKo",
  authDomain: "mindx-6a09e.firebaseapp.com",
  projectId: "mindx-6a09e",
  storageBucket: "mindx-6a09e.firebasestorage.app",
  messagingSenderId: "772532169184",
  appId: "1:772532169184:web:42244a9c0595e3895aa385",
  measurementId: "G-JTFXFVSK5D"
};

// Initialize Firebase safely (avoiding re-initialization during hot reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics (safely on client-side only)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics };
