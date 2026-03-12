import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration updated with the valid API key provided by the user
const firebaseConfig = {
    apiKey: "AIzaSyDq9NfEcmAI0Mzh825rDa4ZgIpTpYSB-7o",
    authDomain: "kult-discovery.firebaseapp.com",
    projectId: "kult-discovery",
    storageBucket: "kult-discovery.firebasestorage.app",
    messagingSenderId: "12131820673",
    appId: "1:12131820673:web:682dce3002a681d11b9980",
    measurementId: "G-LEERZ24PL9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
