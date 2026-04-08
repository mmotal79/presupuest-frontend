import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Importamos la configuración que creaste
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchador en tiempo real de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        setUserToken(token);
        
        // Aquí simulamos la carga de datos adicionales del backend si fuera necesario
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.email === 'mmotal@gmail.com' ? 'admin' : 'cliente' // Root Admin check
        });
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setUserToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userToken,
    isAuthenticated: !!currentUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Componente para proteger rutas
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="p-10 text-center">Cargando seguridad...</div>;
  
  return isAuthenticated ? children : <window.location.assign href="/login" />;
};