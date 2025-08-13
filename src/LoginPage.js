// Autor: Ing. Miguel Mota
// Fecha de Creación: 30/07/2025 19:35
// Nombre del Archivo: LoginPage.js (Control de cambio y secuencia N° 004: Integración con endpoint de autenticación)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente LoginPage.
 *
 * Esta página maneja el inicio de sesión del usuario.
 * Se comunica con el endpoint de autenticación del backend para validar las credenciales.
 * Si la autenticación es exitosa, redirige al usuario al Dashboard y pasa el token y el rol del usuario.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onLoginSuccess - Función de callback que se ejecuta al iniciar sesión exitosamente.
 * Recibe el token y el rol del usuario como argumentos.
 * @returns {JSX.Element} El elemento JSX de la página de inicio de sesión.
 */
const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState(''); // Cambiado de 'username' a 'email'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para mostrar un indicador de carga
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Realiza una llamada a la API de autenticación del backend.
   * Si la autenticación es exitosa, llama a onLoginSuccess y redirige al dashboard.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) { // Si la respuesta es exitosa (código 2xx)
        if (data.token && data.rol) {
          onLoginSuccess(data.token, data.rol);
          navigate('/'); // Redirige al dashboard
        } else {
          setError('Respuesta de autenticación incompleta. Falta token o rol.');
        }
      } else {
        // Si la respuesta no es exitosa, el backend enviará un mensaje de error
        setError(data.message || 'Error al iniciar sesión. Credenciales incorrectas.');
      }
    } catch (err) {
      console.error('Error de red o del servidor:', err);
      setError('No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email" // Cambiado a type="email"
              id="email"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="tu.correo@ejemplo.com" // Placeholder actualizado
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm italic mb-4 text-center">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-xs mt-6">
          Consejo: Usa un correo y contraseña registrados en tu backend.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
