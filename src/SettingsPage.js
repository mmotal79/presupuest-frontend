import React from 'react';

/**
 * Componente SettingsPage.
 *
 * Esta página permitirá a los usuarios configurar las preferencias de la aplicación.
 * Por ahora, es un marcador de posición.
 *
 * @returns {JSX.Element} El elemento JSX de la página de Ajustes.
 */
const SettingsPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ajustes</h1>
      <p className="text-gray-700 text-lg mb-4">
        Gestiona las configuraciones de tu cuenta y preferencias de la aplicación aquí.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Sección de Perfil */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Perfil de Usuario</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                defaultValue="UsuarioEjemplo"
                disabled // Deshabilitado por ahora
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                defaultValue="usuario@ejemplo.com"
                disabled // Deshabilitado por ahora
              />
            </div>
            <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Sección de Preferencias */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Preferencias de la Aplicación</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda por Defecto</label>
              <select
                id="currency"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                defaultValue="USD"
              >
                <option value="USD">Dólar Estadounidense (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="VES">Bolívar Soberano (VES)</option>
                {/* Agrega más monedas según sea necesario */}
              </select>
            </div>
            <div>
              <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">Notificaciones</label>
              <input
                type="checkbox"
                id="notifications"
                className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">Recibir notificaciones por correo electrónico</span>
            </div>
          </div>
        </div>

        {/* Sección de Seguridad */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Seguridad</h2>
          <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
