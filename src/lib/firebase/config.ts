import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfpWI_2vdYOcWl3dOBBrxh0QIWhRm3hPM",
  authDomain: "brayanibp.firebaseapp.com",
  projectId: "brayanibp",
  storageBucket: "brayanibp.firebasestorage.app",
  messagingSenderId: "624154932401",
  appId: "1:624154932401:web:314ea854ef6f7e71431e90",
  measurementId: "G-0B7RXMR2ZR"
};

// Singleton pattern para Next.js (evitar re-inicialización en Hot Reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
