import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Forzar la selección de cuenta siempre
googleProvider.setCustomParameters({ prompt: 'select_account' });

// CAMBIO CRÍTICO: Usar Redirect en lugar de Popup
export const loginWithGoogle = () => {
  return signInWithRedirect(auth, googleProvider);
};