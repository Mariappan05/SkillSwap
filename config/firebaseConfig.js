// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSDBgBpDXulA0CIzK72uk8EuvshJBoaew",
  authDomain: "skillswap-ad542.firebaseapp.com",
  projectId: "skillswap-ad542",
  storageBucket: "skillswap-ad542.firebasestorage.app",
  messagingSenderId: "198740209451",
  appId: "1:198740209451:web:9ebf49c94f0a40bc479f6e",
  measurementId: "G-FNHRHSB010"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };