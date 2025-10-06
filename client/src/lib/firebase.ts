// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQuXW6odRJhk2BO50m9D8V_JvqQuy7H70",
  authDomain: "habit-tracker-bc96e.firebaseapp.com",
  projectId: "habit-tracker-bc96e",
  storageBucket: "habit-tracker-bc96e.firebasestorage.app",
  messagingSenderId: "498234015781",
  appId: "1:498234015781:web:0df86455cd32498bf0bfcc",
  measurementId: "G-7BN4RXZM26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
