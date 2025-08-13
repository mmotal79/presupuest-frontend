import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente NotFoundPage.
 *
 * Esta página se muestra cuando el usuario intenta acceder a una ruta que no existe.
 *
 * @returns {JSX.Element} El elemento JSX de la página 404.
 */
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">¡Oops! Página no encontrada.</p>
      <p className="text-lg text-gray-700 mb-8">
        La página que estás buscando podría haber sido eliminada, cambiado de nombre o no estar disponible temporalmente.
      </p>
      <Link
        to="/"
        className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
