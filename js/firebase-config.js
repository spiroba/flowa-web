// Firebase конфигурация
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDev8X0EEFOMQ8Gsf3eVi9xv9Sr1SRCCDE",
  authDomain: "flowa-85234.firebaseapp.com",
  projectId: "flowa-85234",
  storageBucket: "flowa-85234.firebasestorage.app",
  messagingSenderId: "28624424621",
  appId: "1:28624424621:web:3cd6bf88fb02ffca65c024",
  measurementId: "G-66VZ20FMV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };