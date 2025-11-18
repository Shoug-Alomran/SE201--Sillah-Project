import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7E771XXVJ1tpI26HFTvlQB-SHmGjDPyw",
  authDomain: "sillah-f67d7.firebaseapp.com",
  projectId: "sillah-f67d7",
  storageBucket: "sillah-f67d7.firebasestorage.app",
  messagingSenderId: "764912165444",
  appId: "1:764912165444:web:a163624e77438ed4c31211",
  measurementId: "G-99DBCLEKS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;