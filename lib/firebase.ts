// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Platform } from "react-native";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMwsyOj_BJk2gbW8yIXgg1Pt41Oeoq6zc",
  authDomain: "auto-matcher2.firebaseapp.com",
  projectId: "auto-matcher2",
  storageBucket: "auto-matcher2.firebasestorage.app",
  messagingSenderId: "480642254642",
  appId: "1:480642254642:web:88e7cb2dc28d9aaed7f92b",
  measurementId: "G-BFXYVQ1642",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics only on web platform
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (Platform.OS === "web" && typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
}
export { analytics };

export default app;

