// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHFydbFBZ41MSBTOYB2eoWIo5U7oMOmAI",
  authDomain: "nexuscommerce-d8706.firebaseapp.com",
  projectId: "nexuscommerce-d8706",
  storageBucket: "nexuscommerce-d8706.appspot.com",
  messagingSenderId: "16107366096",
  appId: "1:16107366096:web:48728138d1ab6869f360d5",
  measurementId: "G-NW3QM38TFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);