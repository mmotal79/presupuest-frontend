import React from 'react';

/**
 * Componente Header.
 *
 * Este componente representa el encabezado de la aplicación,
 * conteniendo el título de la aplicación y un botón para
 * alternar la visibilidad de la barra lateral en dispositivos móviles.
 * También incluye un espacio para la información del usuario.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onToggleSidebar - Función para alternar la visibilidad de la barra lateral.
 * @param {boolean} props.isSidebarOpen - Indica si la barra lateral está abierta.
 * @returns {JSX.Element} El elemento JSX del encabezado.
 */
function Header({ onToggleSidebar, isSidebarOpen }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      {/* Botón para alternar la barra lateral en pantallas pequeñas */}
      <button
        onClick={onToggleSidebar}
        className="text-gray-600 focus:outline-none focus:text-gray-900 md:hidden"
        aria-label="Toggle Sidebar"
      >
        {/* Icono de hamburguesa cuando la barra lateral está cerrada */}
        {!isSidebarOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        ) : (
          // Icono de "X" cuando la barra lateral está abierta
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
      </button>

      {/* Título de la aplicación */}
      <h1 className="text-3xl font-bold text-gray-800 flex-1 text-center md:text-left ml-4 md:ml-0">
        Sistema de Diseños y Uniformes T&G Publieventos,c.a.
      </h1>

      {/* Sección de perfil de usuario (visible solo en pantallas medianas y grandes) */}
      <div className="hidden md:block">
        <span className="text-gray-600 font-medium">Usuario: Miguel</span>
        {/* Aquí podrías añadir un icono de usuario o un menú desplegable */}
      </div>
    </header>
  );
}

export default Header;
