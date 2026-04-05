import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPo6MwyaDR5QJKQzRpjlPxbxwgxoy4RtU",
  authDomain: "attendx-rit.firebaseapp.com",
  projectId: "attendx-rit",
  storageBucket: "attendx-rit.firebasestorage.app",
  messagingSenderId: "623567089487",
  appId: "1:623567089487:web:e1c25425b4d14dbfc05f3a",
  measurementId: "G-Q8GFDZLVGW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
