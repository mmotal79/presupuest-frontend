// Autor: Ing. Miguel Mota
// Archivo: AuthContext.js (MODO BYPASS PARA DESARROLLO)

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // FORZAMOS EL ESTADO: Usuario ya logueado como Admin
  const [currentUser, setCurrentUser] = useState({
    uid: 'admin-bypass-001',
    email: 'mmotal@gmail.com',
    displayName: 'Miguel Mota (Admin)',
    role: 'admin'
  });
  
  const [userToken, setUserToken] = useState('token-temporal-bypass');
  const [loading, setLoading] = useState(false); // No hay espera

  useEffect(() => {
    // Desactivamos el escuchador de Firebase para evitar errores 400/404
    console.log("Sistema operando en modo Bypass de Seguridad.");
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setUserToken(null);
    window.location.assign('/login');
  };

  const value = {
    currentUser,
    userToken,
    isAuthenticated: true, // Siempre autenticado
    logout,
    loading: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

// Componente de Ruta Privada: Ahora deja pasar a todos
export const PrivateRoute = ({ children }) => {
  return children;
};
