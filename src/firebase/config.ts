
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debugging: Log partial keys to verify Vercel injection
console.log("Environment Check:");
console.log("Firebase API Key source:", import.meta.env.VITE_FIREBASE_API_KEY ? "Loaded" : "Missing");
console.log("Gemini API Key source:", import.meta.env.VITE_GEMINI_API_KEY ? "Loaded" : "Missing");
if (import.meta.env.VITE_FIREBASE_API_KEY) {
  console.log("Firebase Key prefix:", import.meta.env.VITE_FIREBASE_API_KEY.substring(0, 5) + "...");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
