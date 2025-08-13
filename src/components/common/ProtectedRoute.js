import React from 'react';
import { Navigate } from 'react-router-dom';
// Importa tu contexto de autenticación o el hook que provea el estado de autenticación
// Por ejemplo: import { useAuth } from '../../context/AuthContext';

/**
 * Componente ProtectedRoute
 *
 * Este componente se utiliza para proteger rutas en la aplicación.
 * Si el usuario no está autenticado, será redirigido a la página de inicio de sesión.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que se renderizarán si el usuario está autenticado.
 * @returns {React.ReactNode} Los componentes hijos o un redireccionamiento.
 */
const ProtectedRoute = ({ children }) => {
  // Aquí deberías obtener el estado de autenticación de tu contexto o store global.
  // Por ejemplo: const { isAuthenticated } = useAuth();
  // Para este ejemplo, simularemos que el usuario NO está autenticado.
  // DEBES reemplazar esta lógica con tu verdadera comprobación de autenticación.
  const isAuthenticated = false; // <--- ¡IMPORTANTE! Reemplaza esto con tu lógica de autenticación real.

  if (!isAuthenticated) {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión.
    // 'replace' asegura que la entrada actual en el historial de navegación sea reemplazada,
    // impidiendo que el usuario regrese a la página protegida con el botón de "atrás".
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, renderiza los componentes hijos.
  return children;
};

export default ProtectedRoute;
