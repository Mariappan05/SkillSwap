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
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Register service worker
async function registerServiceWorker() {
    try {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported in this browser');
        }

        console.log('Registering service worker...');

        // Unregister any existing service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('Found existing service workers:', registrations.length);
        for (let registration of registrations) {
            await registration.unregister();
            console.log('Unregistered service worker:', registration.scope);
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
        });
        
        console.log('Service Worker registered successfully with scope:', registration.scope);
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
    }
}

// Function to get FCM token
async function getFCMToken() {
    try {
        console.log('Starting FCM token generation process...');
        
        // First register service worker
        const registration = await registerServiceWorker();
        
        // Request permission
        console.log('Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('Notification permission status:', permission);
        
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }

        // Get FCM token
        console.log('Getting FCM token...');
        const currentToken = await messaging.getToken({
            vapidKey: 'BB0dy30tDBvPNfhY8k4xfu45YoKBbUxShMlVQYnQfuWn5yyL1Qs6lfvR7LevPxHVl8mUFIzX2M6RIfcQ2le3Ihs',
            serviceWorkerRegistration: registration
        });

        if (currentToken) {
            console.log('FCM Token generated successfully:', currentToken);
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
        console.log('Updating FCM token on server...');
        
        // Get the JWT token from localStorage
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            console.error('No JWT token found in localStorage. Please log in first.');
            throw new Error('Please log in first to update FCM token');
        }
        console.log('Found JWT token in localStorage');

        const response = await fetch('/api/notifications/update-fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ fcmToken: token })
        });

        const data = await response.json();
        console.log('Server response:', data);
        
        if (data.success) {
            console.log('FCM Token updated successfully on server');
        } else {
            console.error('Failed to update FCM token on server:', data.message);
            throw new Error(data.message || 'Failed to update FCM token');
        }
    } catch (error) {
        console.error('Error updating FCM token on server:', error);
        throw error;
    }
}

// Listen for messages
if (messaging) {
    // Handle foreground messages
    messaging.onMessage((payload) => {
        console.log('Message received:', payload);
    });
}

// Make getFCMToken available globally
window.getFCMToken = getFCMToken; 