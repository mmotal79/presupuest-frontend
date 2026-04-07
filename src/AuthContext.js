// Autor: Ing. Miguel Mota
// Fecha de Creación: 2025-08-20 22:30
// Fecha de Modificación: 27/08/2025 22:11 VET
// Nombre del Archivo: AuthContext.js (Control de cambio y secuencia N° 016: Manejo de errores en login y corrección de TypeError)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Esperar a que el estado de autenticación esté listo
  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      // Si el usuario no está autenticado, redirigir a la página de login
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthReady, isAuthenticated, navigate, location]);

  return isAuthenticated ? children : null;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  // Función de login mejorada para manejar errores
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verificar si la respuesta no fue exitosa
      if (!response.ok) {
        // Leer el mensaje de error del servidor si está disponible
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión. Credenciales inválidas.');
      }

      const data = await response.json();
      
      // Asegurarse de que la respuesta contiene el token y el rol
      if (!data.token || !data._id || !data.rol) {
        throw new Error('Respuesta de autenticación incompleta del servidor.');
      }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('currentUserRole', data.rol);
	  localStorage.setItem('currentUserName', data.nombre);
      
      setUserToken(data.token);
      setCurrentUserRole(data.rol);
	  setCurrentUserName(data.nombre);
      setIsAuthenticated(true);
      
      return data; // Devolver los datos para que LoginPage pueda usarlos
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUserToken(null);
      setCurrentUserRole(null);
	  setCurrentUserName(null);
      throw error; // Propagar el error para que LoginPage lo maneje
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUserRole');
    setIsAuthenticated(false);
    setUserToken(null);
    setCurrentUserRole(null);
	setCurrentUserName(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('currentUserRole');
	const name = localStorage.getItem('currentUserName');
    if (token) {
      setUserToken(token);
      setCurrentUserRole(role);
	  setCurrentUserName(name);
      setIsAuthenticated(true);
    }
    // Marcar que la autenticación inicial ha terminado
    setIsAuthReady(true);
  }, []);

  const value = {
    isAuthenticated,
    userToken,
    currentUserRole,
	currentUserName,
    isAuthReady,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
