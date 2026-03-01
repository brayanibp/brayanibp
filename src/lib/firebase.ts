import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfpWI_2vdYOcWl3dOBBrxh0QIWhRm3hPM",
  authDomain: "brayanibp.firebaseapp.com",
  projectId: "brayanibp",
  storageBucket: "brayanibp.firebasestorage.app",
  messagingSenderId: "624154932401",
  appId: "1:624154932401:web:314ea854ef6f7e71431e90",
  measurementId: "G-0B7RXMR2ZR"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
