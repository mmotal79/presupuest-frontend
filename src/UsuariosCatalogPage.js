// Autor: Ing. Miguel Mota
// Fecha de Creación: 02/08/2025
// Nombre del Archivo: UsuariosCatalogPage.js (Control de cambio y secuencia N° 004: Implementación de lógica de negocio para roles)

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  InformationCircleIcon,
  ArrowPathIcon // Icono para el reseteo de contraseña
} from '@heroicons/react/24/outline';

/**
 * Componente para gestionar el catálogo de Usuarios del Sistema.
 * Muestra los datos en una tabla y permite las operaciones de CRUD.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.userToken - Token de autenticación del usuario, necesario para las operaciones CRUD.
 * @param {string} props.currentUserRole - Rol del usuario actual para la lógica de negocio.
 * @returns {JSX.Element} Elemento JSX que representa la página del catálogo con una tabla.
 */
const UsuariosCatalogPage = ({ userToken, currentUserRole }) => {
  // URL base de la API para este catálogo
  const apiBaseUrl = "http://localhost:3001/api/users";
  const catalogTitle = "Catálogo de Usuarios del Sistema";

  // Estados para la gestión de datos y UI
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de edición/creación
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState({
    id: '',
    nombre: '',
    email: '',
    rol: '',
    activo: true
  });
  const [formError, setFormError] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);

  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estados para el modal de reseteo de contraseña
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);

  /**
   * Obtiene la lista de usuarios desde la API.
   * La lógica de negocio para el rol 'gerente' se aplica aquí.
   */
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiBaseUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos de la API.');
      }

      let data = await response.json();

      // Lógica de negocio: El rol 'gerente' no debe ver los usuarios con rol 'admin'.
      if (currentUserRole === 'gerente') {
        data = data.filter(user => user.rol !== 'admin');
      }

      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userToken, currentUserRole]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Manejadores de los modales del formulario
  const handleOpenFormModal = (item = null) => {
    // Solo los roles 'admin' y 'gerente' pueden editar/crear
    if (currentUserRole !== 'admin' && currentUserRole !== 'gerente') {
      alert("No tienes permiso para realizar esta operación.");
      return;
    }
    setIsEditing(!!item);
    setCurrentUsuario(item || {
      id: uuidv4(),
      nombre: '',
      email: '',
      rol: '',
      activo: true
    });
    setFormError('');
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentUsuario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejador del envío del formulario (Crear/Editar)
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setLoadingModal(true);
    setFormError('');

    // Validación básica
    if (!currentUsuario.nombre || !currentUsuario.email || !currentUsuario.rol) {
      setFormError('Todos los campos son obligatorios.');
      setLoadingModal(false);
      return;
    }

    // Lógica de negocio: Si el rol es 'gerente', no puede crear usuarios con rol 'admin'
    if (currentUserRole === 'gerente' && currentUsuario.rol === 'admin') {
      setFormError('El rol "gerente" no puede crear usuarios con rol "admin".');
      setLoadingModal(false);
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${apiBaseUrl}/${currentUsuario.id}` : apiBaseUrl;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentUsuario)
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? 'editar' : 'crear'} el usuario.`);
      }

      // Recarga los datos para reflejar los cambios
      await fetchUsuarios();
      setShowFormModal(false);

    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoadingModal(false);
    }
  };

  // Manejadores del modal de eliminación
  const handleOpenDeleteModal = (item) => {
    // Solo los roles 'admin' y 'gerente' pueden eliminar
    if (currentUserRole !== 'admin' && currentUserRole !== 'gerente') {
      alert("No tienes permiso para realizar esta operación.");
      return;
    }
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDeleteItem = async () => {
    setLoadingModal(true);
    setFormError('');

    try {
      const response = await fetch(`${apiBaseUrl}/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario.');
      }

      // Recarga los datos para reflejar los cambios
      await fetchUsuarios();
      setShowDeleteModal(false);

    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoadingModal(false);
    }
  };

  // Manejadores del modal de reseteo de contraseña
  const handleOpenResetPasswordModal = (item) => {
    // Solo los roles 'admin' y 'gerente' pueden resetear la contraseña
    if (currentUserRole !== 'admin' && currentUserRole !== 'gerente') {
      alert("No tienes permiso para realizar esta operación.");
      return;
    }
    setUserToReset(item);
    setShowResetPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
    setUserToReset(null);
  };

  const confirmResetPassword = async () => {
    setLoadingModal(true);
    setFormError('');

    try {
      // Endpoint y datos para el reseteo
      const resetUrl = `${apiBaseUrl}/${userToReset.id}/reset-password`;
      const newPasswordData = {
        newPassword: '12345678'
      };

      const response = await fetch(resetUrl, {
        method: 'PATCH', // Usamos PATCH para actualizar solo un campo
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPasswordData)
      });

      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña.');
      }

      // Cerrar el modal y recargar los datos
      setShowResetPasswordModal(false);
      // Opcional: mostrar un mensaje de éxito
      console.log('Contraseña restablecida con éxito para el usuario:', userToReset.email);

    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoadingModal(false);
    }
  };


  // Renderizado del componente
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado y botón para añadir */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{catalogTitle}</h1>
          {(currentUserRole === 'admin' || currentUserRole === 'gerente') && (
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
              onClick={() => handleOpenFormModal()}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Añadir Usuario</span>
            </button>
          )}
        </div>

        {/* Mensajes de estado */}
        {loading && <p className="text-center text-gray-600">Cargando usuarios...</p>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>}

        {/* Tabla de usuarios */}
        {!loading && !error && usuarios.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* El ID no se muestra si el rol es 'gerente' */}
                    {currentUserRole !== 'gerente' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map(usuario => (
                    <tr key={usuario.id} className="hover:bg-gray-50 transition duration-150">
                      {/* El ID no se muestra si el rol es 'gerente' */}
                      {currentUserRole !== 'gerente' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.id}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.rol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {usuario.activo ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        {(currentUserRole === 'admin' || currentUserRole === 'gerente') && (
                          <>
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Editar"
                              onClick={() => handleOpenFormModal(usuario)}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                              onClick={() => handleOpenDeleteModal(usuario)}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Restablecer Contraseña"
                              onClick={() => handleOpenResetPasswordModal(usuario)}
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal para el formulario de Creación/Edición */}
      {showFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="relative p-8 bg-white w-96 max-w-md mx-auto rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
              <button onClick={handleCloseFormModal} className="text-gray-400 hover:text-gray-600 transition">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {formError && (
              <div className="text-red-500 text-sm mt-2">{formError}</div>
            )}
            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              {/* Campo Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={currentUsuario.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={currentUsuario.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              {/* Campo Rol */}
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  name="rol"
                  id="rol"
                  value={currentUsuario.rol}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                  disabled={currentUserRole === 'gerente' && isEditing && currentUsuario.rol === 'admin'} // Un gerente no puede cambiar el rol de un admin
                >
                  <option value="">Selecciona un rol</option>
                  <option value="usuario">usuario</option>
                  <option value="gerente">gerente</option>
                  <option value="admin" disabled={currentUserRole === 'gerente'}>admin</option>
                </select>
                {currentUserRole === 'gerente' && (
                  <p className="mt-2 text-xs text-gray-500">
                    <InformationCircleIcon className="h-4 w-4 inline-block mr-1 text-blue-500" />
                    El rol "gerente" no puede seleccionar el rol "admin".
                  </p>
                )}
              </div>
              {/* Campo Activo */}
              <div className="flex items-center">
                <input
                  id="activo"
                  name="activo"
                  type="checkbox"
                  checked={currentUsuario.activo}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                  Usuario Activo
                </label>
              </div>
              {/* Botones del formulario */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
                  onClick={handleCloseFormModal}
                  disabled={loadingModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingModal}
                >
                  {loadingModal ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.962l3-2.671z"></path>
                    </svg>
                  ) : (
                    isEditing ? 'Guardar Cambios' : 'Crear Usuario'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="relative p-8 bg-white w-96 max-w-sm mx-auto rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h3>
            <p className="mt-4 text-gray-600">
              ¿Estás seguro de que deseas eliminar a <span className="font-bold">{itemToDelete.nombre}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
                onClick={handleCloseDeleteModal}
                disabled={loadingModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={confirmDeleteItem}
                disabled={loadingModal}
              >
                {loadingModal ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.962l3-2.671z"></path>
                  </svg>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de reseteo de contraseña */}
      {showResetPasswordModal && userToReset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="relative p-8 bg-white w-96 max-w-sm mx-auto rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900">Restablecer Contraseña</h3>
            <p className="mt-4 text-gray-600">
              ¿Estás seguro de que deseas restablecer la contraseña para <span className="font-bold">{userToReset.email}</span>?
              La nueva contraseña será: <span className="font-mono bg-gray-200 px-2 py-1 rounded">12345678</span>.
            </p>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
                onClick={handleCloseResetPasswordModal}
                disabled={loadingModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={confirmResetPassword}
                disabled={loadingModal}
              >
                {loadingModal ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.962l3-2.671z"></path>
                  </svg>
                ) : (
                  'Restablecer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosCatalogPage;
