// Autor: Ing. Miguel Mota
// Fecha de Creación: 02/08/2025
// Nombre del Archivo: UsuariosCatalogPage.js (Control de cambio y secuencia N° 002: Corrección en la función de guardado y recarga de datos)

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

/**
 * Componente para gestionar el catálogo de Usuarios del Sistema.
 * Muestra los datos en una tabla y permite las operaciones de CRUD.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.userToken - Token de autenticación del usuario, necesario para las operaciones CRUD.
 * @returns {JSX.Element} Elemento JSX que representa la página del catálogo con una tabla.
 */
const UsuariosCatalogPage = ({ userToken }) => {
  // URL base de la API para este catálogo
  const apiBaseUrl = "http://localhost:3001/api/users";
  const catalogTitle = "Catálogo de Usuarios del Sistema";

  // Estados para la gestión de datos y UI
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la gestión de modales y formularios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  // Estado para el formulario de nuevo/edición de ítem
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'user', // Valor por defecto
  });

  /**
   * Muestra una notificación temporal.
   * En un entorno real, esta función se comunicaría con un componente de notificación global.
   * @param {string} message - Mensaje a mostrar.
   * @param {string} type - Tipo de notificación ('success', 'error', 'info').
   */
  const showNotification = (message, type) => {
    // Aquí podrías usar una librería como 'react-toastify'
    // Por ahora, solo se mostrará en la consola.
    console.log(`[Notificación - ${type.toUpperCase()}]: ${message}`);
  };

  /**
   * Carga los datos del catálogo desde la API.
   * Utiliza useCallback para memorizar la función y optimizar el rendimiento.
   */
  const fetchUsuarios = useCallback(async () => {
    if (!userToken) {
      setError('No autorizado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      };
      const response = await fetch(apiBaseUrl, { headers });
      if (!response.ok) {
        // Manejo de errores más específico de la API
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los datos del catálogo');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('No se pudo cargar el catálogo. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  /**
   * Maneja el cambio en los campos del formulario del modal.
   * @param {Event} e - Evento del input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Abre el modal para crear un nuevo ítem.
   */
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'user',
    });
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  /**
   * Abre el modal para editar un ítem existente.
   * @param {object} item - El ítem a editar.
   */
  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setFormData({
      nombre: item.nombre || '',
      email: item.email || '',
      password: '', // No cargamos la contraseña en el formulario de edición por seguridad
      rol: item.rol || 'user',
    });
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  /**
   * Cierra el modal de creación/edición.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  /**
   * Abre el modal de confirmación para eliminar un ítem.
   * @param {object} item - El ítem a eliminar.
   */
  const handleOpenDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  /**
   * Cierra el modal de confirmación de eliminación.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentItem(null);
  };

  /**
   * Confirma la eliminación de un ítem.
   */
  const confirmDeleteItem = async () => {
    if (!currentItem || !currentItem._id) {
      showNotification('Error: Ítem no válido para eliminar.', 'error');
      return;
    }

    setLoadingModal(true);
    try {
      const headers = {
        'Authorization': `Bearer ${userToken}`,
      };
      const response = await fetch(`${apiBaseUrl}/${currentItem._id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ítem.');
      }

      showNotification('Usuario eliminado con éxito', 'success');
      fetchUsuarios(); // Actualizar la lista
    } catch (err) {
      showNotification('Error al eliminar el usuario: ' + err.message, 'error');
      console.error("Error deleting item:", err);
    } finally {
      setLoadingModal(false);
      handleCloseDeleteModal();
    }
  };

  /**
   * Guarda un nuevo ítem o actualiza uno existente.
   */
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setLoadingModal(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      };
      
      const method = isEditMode && currentItem ? 'PUT' : 'POST';
      const url = isEditMode && currentItem ? `${apiBaseUrl}/${currentItem._id}` : apiBaseUrl;

      // Si es modo de edición, solo enviamos los campos que se pueden editar
      // No incluimos la contraseña si es edición para no re-escribirla
      const dataToSend = isEditMode
        ? {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol,
        }
        : formData;

      const response = await fetch(url, {
        method: method,
        headers,
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el usuario.`);
      }

      showNotification(`Usuario ${isEditMode ? 'actualizado' : 'creado'} con éxito`, 'success');
      
      // La clave está en recargar los datos de la API después de una operación exitosa
      await fetchUsuarios();
      
      handleCloseModal();
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
      console.error("Error saving item:", err);
    } finally {
      setLoadingModal(false);
    }
  };


  // Renderizado condicional basado en el estado de carga y errores
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">{catalogTitle}</h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
        >
          <PlusCircleIcon className="h-6 w-6" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {usuarios.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((item) => (
                <tr key={item._id || uuidv4()} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rol || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.fechaRegistro ? new Date(item.fechaRegistro).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-300"
                        title="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(item)}
                        className="text-red-600 hover:text-red-900 transition duration-300"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <InformationCircleIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios en el catálogo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aún no has agregado ningún usuario. ¡Usa el botón "Nuevo Usuario" para empezar!
          </p>
        </div>
      )}

      {/* Modal para Crear/Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleSaveItem}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {!isEditMode && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                  <select
                    name="rol"
                    id="rol"
                    required
                    value={formData.rol}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="user">Usuario Estándar</option>
                    <option value="gerente">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
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
                    <svg className="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isEditMode ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <TrashIcon className="mx-auto h-16 w-16 text-red-500" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">¿Estás seguro?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Estás a punto de eliminar el ítem: <span className="font-semibold">{currentItem?.nombre}</span>. Esta acción no se puede deshacer.
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosCatalogPage;
