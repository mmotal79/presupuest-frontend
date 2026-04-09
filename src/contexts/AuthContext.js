// Autor: Ing. Miguel Mota
// Archivo: AuthContext.js (Optimizado para flujo de Redirección Firebase)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; 
import { 
  onAuthStateChanged, 
  signOut, 
  getRedirectResult, 
  getIdTokenResult 
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Gestionar el resultado de la redirección al montar el componente
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Acceso exitoso vía redirección:", result.user.email);
          // El token se actualizará automáticamente mediante onAuthStateChanged
        }
      } catch (error) {
        console.error("Error en flujo de redirección:", error.code, error.message);
        // Aquí podrías disparar una notificación de error al usuario
      }
    };

    handleRedirect();

    // 2. Escuchador de estado de autenticación (La fuente de verdad)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Forzamos la obtención del token y sus claims (útil para roles)
          const tokenResult = await getIdTokenResult(user);
          const token = tokenResult.token;
          
          localStorage.setItem('token', token);
          setUserToken(token);
          
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            // Asignación de rol basada en tu lógica actual
            role: user.email === 'mmotal@gmail.com' ? 'admin' : 'cliente',
            claims: tokenResult.claims
          });
        } catch (tokenError) {
          console.error("Error obteniendo claims del token:", tokenError);
        }
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setUserToken(null);
      }
      
      // Solo dejamos de cargar una vez que Firebase confirma el estado inicial
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value = {
    currentUser,
    userToken,
    isAuthenticated: !!currentUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Validando credenciales...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// Componente de Ruta Privada optimizado
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null; // El Provider ya maneja el spinner
  
  // Si no está autenticado, redirigimos al login de forma limpia
  if (!isAuthenticated) {
    window.location.assign('/login');
    return null;
  }
  
  return children;
};
