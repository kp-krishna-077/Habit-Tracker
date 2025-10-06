importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDQuXW6odRJhk2BO50m9D8V_JvqQuy7H70",
  authDomain: "habit-tracker-bc96e.firebaseapp.com",
  projectId: "habit-tracker-bc96e",
  storageBucket: "habit-tracker-bc96e.firebasestorage.app",
  messagingSenderId: "498234015781",
  appId: "1:498234015781:web:0df86455cd32498bf0bfcc",
  measurementId: "G-7BN4RXZM26"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
