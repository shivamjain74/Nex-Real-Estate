// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-fbec3.firebaseapp.com",
  projectId: "mern-estate-fbec3",
  storageBucket: "mern-estate-fbec3.appspot.com",
  messagingSenderId: "587828202234",
  appId: "1:587828202234:web:6b807f4ffbbdeeb0011743"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

