const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getMessaging, getToken } = require('firebase/messaging');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const messaging = getMessaging(app);

// Function to get FCM token
const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BB0dy30tDBvPNfhY8k4xfu45YoKBbUxShMlVQYnQfuWn5yyL1Qs6lfvR7LevPxHVl8mUFIzX2M6RIfcQ2le3Ihs" // You'll need to get this from Firebase Console
    });
    
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Initialize Firebase Admin
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId
    });
  }
  return admin;
};

module.exports = {
  app,
  messaging,
  getFCMToken,
  initializeFirebase
};