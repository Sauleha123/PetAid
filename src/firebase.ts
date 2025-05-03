// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYqYkb5UmUSv5J7xoPhZmyPAutJ6sUtNg",
  authDomain: "petaid-6f029.firebaseapp.com",
  databaseURL: "https://petaid-6f029-default-rtdb.firebaseio.com",
  projectId: "petaid-6f029",
  storageBucket: "petaid-6f029.firebasestorage.app", // Note: Corrected to match Firebase Storage format
  messagingSenderId: "235374440218",
  appId: "1:235374440218:web:a4d08a3ce9f051a00686a3",
  measurementId: "G-JPVS8BE1DD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };