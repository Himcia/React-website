import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH3FrARdD_VAs-QFWYVmePpyKnPfyVakI",
  authDomain: "projekt-zaliczeniowy-a0cb1.firebaseapp.com",
  projectId: "projekt-zaliczeniowy-a0cb1",
  storageBucket: "projekt-zaliczeniowy-a0cb1.appspot.com",
  messagingSenderId: "56010088246",
  appId: "1:56010088246:web:62e8b96aa5df379bdcdd97",
  measurementId: "G-TW7RQDV02Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
