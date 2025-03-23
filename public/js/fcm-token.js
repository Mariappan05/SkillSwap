// Firebase configuration
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
let messaging = null;
try {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Register service worker
async function registerServiceWorker() {
    try {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported in this browser');
        }

        // Unregister any existing service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
        });
        
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
    }
}

// Function to get FCM token
async function getFCMToken() {
    try {
        // First register service worker
        const registration = await registerServiceWorker();
        
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }

        // Get FCM token
        const currentToken = await messaging.getToken({
            vapidKey: 'BB0dy30tDBvPNfhY8k4xfu45YoKBbUxShMlVQYnQfuWn5yyL1Qs6lfvR7LevPxHVl8mUFIzX2M6RIfcQ2le3Ihs',
            serviceWorkerRegistration: registration
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
        throw error;
    }
}

// Function to update FCM token on server
async function updateFCMToken(token) {
    try {
        const response = await fetch('/api/test/update-fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
if (messaging) {
    messaging.onTokenRefresh(async () => {
        console.log('Token refreshed');
        const newToken = await getFCMToken();
        if (newToken) {
            await updateFCMToken(newToken);
        }
    });
}

// Export functions
window.getFCMToken = getFCMToken; 