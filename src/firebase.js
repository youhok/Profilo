// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration (from Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyAG6heaML7OK-mSH1YhmLwUeA3DtFPHuhE",
    authDomain: "profilo-3d7c0.firebaseapp.com",
    projectId: "profilo-3d7c0",
    storageBucket: "profilo-3d7c0.firebasestorage.app",
    messagingSenderId: "250818446180",
    appId: "1:250818446180:web:80cc230dc4c378af093071",
    measurementId: "G-63YKGV9JBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
const authInstance = getAuth(app);
// Keep users signed in across tabs/reloads
setPersistence(authInstance, browserLocalPersistence).catch(() => {});
export const auth = authInstance;
export const storage = getStorage(app);
export { app };
