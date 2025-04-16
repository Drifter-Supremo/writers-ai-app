import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDxm3KU_zskuetIJghqs6mJUrBBXOwNBvk",
  authDomain: "gorlea-notebook.firebaseapp.com",
  projectId: "gorlea-notebook",
  storageBucket: "gorlea-notebook.firebasestorage.app",
  messagingSenderId: "765002073529",
  appId: "1:765002073529:web:f5233102c891b197616268"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Auth
const auth = getAuth(app);

export { db, storage, auth };
