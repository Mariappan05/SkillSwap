// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

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
async function getFCMToken() {
    try {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }

        // Get FCM token
        const currentToken = await getToken(messaging, {
            vapidKey: 'BB0dy30tDBvPNfhY8k4xfu45YoKBbUxShMlVQYnQfuWn5yyL1Qs6lfvR7LevPxHVl8mUFIzX2M6RIfcQ2le3Ihs'
        });

        if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Send token to server
            await updateFCMToken(currentToken);
            return currentToken;
        } else {
            console.log('No registration token available.');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
}

// Function to update FCM token on server
async function updateFCMToken(token) {
    try {
        const response = await fetch('/api/test/update-fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT token in localStorage
            },
            body: JSON.stringify({ fcmToken: token })
        });

        const data = await response.json();
        if (data.success) {
            console.log('FCM Token updated successfully on server');
        } else {
            console.error('Failed to update FCM token on server:', data.message);
        }
    } catch (error) {
        console.error('Error updating FCM token on server:', error);
    }
}

// Listen for token refresh
messaging.onTokenRefresh(async () => {
    console.log('Token refreshed');
    const newToken = await getFCMToken();
    if (newToken) {
        await updateFCMToken(newToken);
    }
});

// Export functions
export { getFCMToken, updateFCMToken }; 