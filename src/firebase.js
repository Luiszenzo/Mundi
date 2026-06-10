import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTUyMuhuGoMfl0CIrUjKnYGOrCkZ1JczM",
  authDomain: "mundi-df835.firebaseapp.com",
  projectId: "mundi-df835",
  storageBucket: "mundi-df835.firebasestorage.app",
  messagingSenderId: "368928685931",
  appId: "1:368928685931:web:058edce09b9a722a85162e",
  measurementId: "G-T16KJPHD3E"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
