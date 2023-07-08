// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5aF94kfn0s642dOcMUje8DFqLYce1HWo",
  authDomain: "preschool-11c5e.firebaseapp.com",
  projectId: "preschool-11c5e",
  storageBucket: "preschool-11c5e.appspot.com",
  messagingSenderId: "1067889549030",
  appId: "1:1067889549030:web:d35eb5b84c816654fc6527",
  measurementId: "G-WQWX673SZY",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const firebase = getFirestore(app);
const analytics = getAnalytics(app);
