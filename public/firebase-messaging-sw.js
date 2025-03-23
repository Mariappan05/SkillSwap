importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

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
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png',
        badge: '/firebase-logo.png',
        data: payload.data,
        tag: payload.data?.tag || 'default',
        renotify: true,
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Open'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('Push subscription changed:', event);
});

// Handle push event
self.addEventListener('push', (event) => {
    console.log('Push event received:', event);
    if (event.data) {
        const data = event.data.json();
        console.log('Push data:', data);
    }
}); 