// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrahXeTJBhYZtFf67LFJboTOBBK-c5yUU",
  authDomain: "dyslexiachatbot-78450.firebaseapp.com",
  projectId: "dyslexiachatbot-78450",
  storageBucket: "dyslexiachatbot-78450.firebasestorage.app",
  messagingSenderId: "405214222164",
  appId: "1:405214222164:web:327a976fc5668909d65ac1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);