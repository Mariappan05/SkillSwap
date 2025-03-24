const { getFCMToken } = require('./config/firebaseConfig');

async function testFCMToken() {
    try {
        const token = await getFCMToken();
        if (token) {
            console.log('Your FCM Token is:', token);
            console.log('\nTo use this token, send it to your backend using:');
            console.log(`
POST /api/notifications/fcm-token
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "fcmToken": "${token}"
}
            `);
        } else {
            console.log('Failed to get FCM token. Please check your browser console for errors.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testFCMToken(); 