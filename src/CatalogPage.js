import React from 'react';

/**
 * Componente de la página de Catálogo.
 *
 * Esta página mostrará el listado de todos los datos del catálogo
 * y permitirá realizar operaciones CRUD sobre ellos.
 *
 * Actualmente es un placeholder. La lógica de carga de datos y CRUD
 * se implementará aquí.
 *
 * @returns {JSX.Element} El elemento JSX de la página de Catálogo.
 */
const CatalogPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Catálogo de Datos</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">
          Aquí se mostrará el listado de todos los datos de tu catálogo.
          En esta sección podrás realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
          sobre tus elementos.
        </p>
        <p className="mt-4 text-gray-600">
          ¡Pronto podrás ver tus datos aquí!
        </p>
      </div>
    </div>
  );
};

export default CatalogPage;
