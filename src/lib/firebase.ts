import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This is a placeholder for the Firebase config.
// In a real application, you would get this from the Firebase Console.
const firebaseConfig = {
  "projectId": "thumbgenius-pz762",
  "appId": "1:675902510186:web:2574aefee340d51ce1e613",
  "storageBucket": "thumbgenius-pz762.firebasestorage.app",
  "apiKey": "AIzaSyB7NL8TmXrEzCwgowPOIrG8EGkQ7ZZYrrE",
  "authDomain": "thumbgenius-pz762.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "675902510186"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
