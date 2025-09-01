import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

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
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);


export { app, auth };
