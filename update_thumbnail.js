import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

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
const db = getFirestore(app);

const docRef = doc(db, "magazines", "ptnTEMnLpWJ7WR5WHjJQ");

async function run() {
  try {
    await updateDoc(docRef, {
      coverImage: "/images/ig_post/beauty_spring_thumbnail.png"
    });
    console.log("Successfully updated the cover image.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating cover image: ", error);
    process.exit(1);
  }
}

run();
