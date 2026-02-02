// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2a2VOZzaibwM3W7FUAVlJvHomqFkoCBM",
  authDomain: "kora-moments.firebaseapp.com",
  projectId: "kora-moments",
  storageBucket: "kora-moments.firebasestorage.app",
  messagingSenderId: "1037988694547",
  appId: "1:1037988694547:web:c0b0376ca5a6fb479e4de6",
  measurementId: "G-HE2XG97LL9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
