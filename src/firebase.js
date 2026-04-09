import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Forzar selección de cuenta
googleProvider.setCustomParameters({ prompt: 'select_account' });

// SOLUCIÓN DEFINITIVA: Popup
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
