import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

// The Firebase config from the user
const firebaseConfig = {
  apiKey: "AIzaSyB-i2fcyDkPLFH99SxLAI9wx7kNzWZu8_8",
  authDomain: "fast-engineering-28b8b.firebaseapp.com",
  projectId: "fast-engineering-28b8b",
  storageBucket: "fast-engineering-28b8b.appspot.com",
  messagingSenderId: "879954481469",
  appId: "1:879954481469:web:cf84dd27157d114b293554"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore Database
export const db = getFirestore(app);

// Authentication Helpers
export const fbSignUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const fbSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const fbGoogleSignIn = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    // If popup is blocked or Cross-Origin policies prevent popups, fall back to redirect
    if (err.code === 'auth/operation-not-supported-in-this-environment' || err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
      return await signInWithRedirect(auth, googleProvider);
    }
    throw err;
  }
};
export const fbSignOut = () => signOut(auth);

export default app;
