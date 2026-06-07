
// Service Worker để xử lý thông báo đẩy khi ứng dụng chạy ngầm
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAXP431cRvqprfOh0R7Nb_4H3ZDBvxoJj0",
  authDomain: "studio-4207560152-47f57.firebaseapp.com",
  projectId: "studio-4207560152-47f57",
  storageBucket: "studio-4207560152-47f57.firebasestorage.app",
  messagingSenderId: "14201871031",
  appId: "1:14201871031:web:22d41415ed219b65034b32"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
