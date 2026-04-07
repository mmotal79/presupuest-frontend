// Autor: Ing. Miguel Mota
// Fecha de Creación: 30/07/2025 19:35
// Nombre del Archivo: LoginPage.js (Control de cambio y secuencia N° 005: Adaptación a AuthContext)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importamos el hook useAuth
import Notification from './components/common/Notification'; // Asegúrate de que esta ruta sea correcta

/**
 * Componente LoginPage.
 *
 * Esta página maneja el inicio de sesión del usuario.
 * Se comunica con el hook useAuth para manejar la autenticación
 * y redirige al usuario al Dashboard si el inicio de sesión es exitoso.
 *
 * @returns {JSX.Element} El elemento JSX de la página de inicio de sesión.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para mostrar un indicador de carga
  const [notification, setNotification] = useState({ message: '', type: '' }); // Estado para las notificaciones
  
  const { login } = useAuth(); // Usamos el hook useAuth para obtener la función login
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Realiza una llamada a la función de login del AuthContext.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: '', type: '' }); // Limpiar notificaciones anteriores

    try {
      // Llamar a la función de login del contexto en lugar de la prop
      const data = await login(email, password);
      
      // Mostrar notificación de éxito
      setNotification({ message: `¡Bienvenido, ${data.nombre || data.email}!`, type: 'success' });
      
      // Redirigir al usuario al dashboard después de un breve retraso para que vea la notificación
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500); // Esperar 1.5 segundos
      
    } catch (error) {
      // Manejar errores del login
      console.error('Error en el inicio de sesión:', error);
      const errorMessage = error.message || 'Error en el inicio de sesión. Credenciales inválidas o error del servidor.';
      setNotification({ message: errorMessage, type: 'error' });
      
    } finally {
      // Desactivar el estado de carga
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-6 py-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default LoginPage;
