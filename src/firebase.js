import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Fuerza a Google a mostrar siempre el selector de cuentas
googleProvider.setCustomParameters({ 
  prompt: 'select_account' 
});

export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error en el popup:", error.code);
    // Si el popup sigue fallando, esto nos dirá por qué en la consola (F12)
    throw error;
  }
};