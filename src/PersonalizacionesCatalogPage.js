// Autor: Ing. Miguel Mota
// Fecha de Creación: 01/08/2025
// Nombre del Archivo: PersonalizacionesCatalogPage.js (Control de cambio y secuencia N° 002: Corrección de error de inconsistencia de datos del backend)

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
 * Componente para gestionar el catálogo de Personalizaciones.
 * Muestra los datos en una tabla y permite las operaciones de CRUD.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.userToken - Token de autenticación del usuario, necesario para las operaciones CRUD.
 * @returns {JSX.Element} Elemento JSX que representa la página del catálogo.
 */
const PersonalizacionesCatalogPage = ({ userToken }) => {
  // URL base de la API para este catálogo
  const apiBaseUrl = "http://localhost:3001/api/catalogos/personalizaciones";
  const catalogTitle = "Catálogo de Personalizaciones";

  // Estados para la gestión de datos y UI
  const [personalizaciones, setPersonalizaciones] = useState([]);
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
    tipo: '',
    nombre: '',
    ubicacion: '',
    costoBase: 0,
    numPuntadasEstimadas: 0,
    numColores: 0,
    costoProgramaPonchado: 0,
    factorComplejidad: '',
  });

  /**
   * Carga los datos del catálogo desde la API.
   * Utiliza useCallback para memorizar la función y optimizar el rendimiento.
   */
  const fetchPersonalizaciones = useCallback(async () => {
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
        throw new Error('Error al obtener los datos del catálogo');
      }
      const data = await response.json();
      setPersonalizaciones(data);
    } catch (err) {
      console.error("Error fetching personalizaciones:", err);
      setError('No se pudo cargar el catálogo. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchPersonalizaciones();
  }, [fetchPersonalizaciones]);

  /**
   * Muestra una notificación temporal.
   * Esta es una implementación simulada. En una app real, usaría un contexto global.
   * @param {string} message - Mensaje a mostrar.
   * @param {string} type - Tipo de notificación ('success', 'error', 'info').
   */
  const showNotification = (message, type) => {
    console.log(`[Notificación - ${type.toUpperCase()}]: ${message}`);
  };

  /**
   * Maneja el cambio en los campos del formulario del modal.
   * @param {Event} e - Evento del input.
   */
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  /**
   * Abre el modal para crear un nuevo ítem.
   */
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData({
      tipo: '',
      nombre: '',
      ubicacion: '',
      costoBase: 0,
      numPuntadasEstimadas: 0,
      numColores: 0,
      costoProgramaPonchado: 0,
      factorComplejidad: '',
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
      tipo: item.tipo || '',
      nombre: item.nombre || '',
      ubicacion: item.ubicacion || '',
      costoBase: item.costoBase || 0,
      numPuntadasEstimadas: item.numPuntadasEstimadas || 0,
      numColores: item.numColores || 0,
      costoProgramaPonchado: item.costoProgramaPonchado || 0,
      factorComplejidad: item.factorComplejidad || '',
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

      showNotification('Ítem eliminado con éxito', 'success');
      fetchPersonalizaciones(); // Actualizar la lista
    } catch (err) {
      showNotification('Error al eliminar el ítem: ' + err.message, 'error');
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
      let response;
      if (isEditMode && currentItem) {
        // Modo de edición: PUT
        response = await fetch(`${apiBaseUrl}/${currentItem._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData),
        });
      } else {
        // Modo de creación: POST
        response = await fetch(apiBaseUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el ítem.`);
      }

      showNotification(`Ítem ${isEditMode ? 'actualizado' : 'creado'} con éxito`, 'success');
      fetchPersonalizaciones(); // Recargar la lista
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
          <span>Nueva Personalización</span>
        </button>
      </div>

      {personalizaciones.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Ubicación</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Costo Base</th>
				<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Método</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Puntadas Estimadas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Colores</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Costo Ponchado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Factor Complejidad</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personalizaciones.map((item) => (
                <tr key={item._id || uuidv4()} className="hover:bg-gray-50 transition-colors">
                  {/*
                    // El siguiente código corrige el error 'undefined.toFixed' al
                    // asegurarse de que el valor existe antes de llamar al método.
                    // Si el valor es undefined, se utiliza 0 como valor por defecto.
                  */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.tipo || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ubicacion || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.costoBase || 0).toFixed(2)}</td>
				  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.metodo || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.numPuntadasEstimadas || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.numColores || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.costoProgramaPonchado || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.factorComplejidad || 'N/A'}</td>
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos en el catálogo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aún no has agregado ninguna personalización. Empieza haciendo clic en el botón de arriba.
          </p>
        </div>
      )}

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loadingModal}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditMode ? 'Editar Personalización' : 'Nueva Personalización'}
            </h3>
            <form onSubmit={handleSaveItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    disabled={loadingModal}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    disabled={loadingModal}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    disabled={loadingModal}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Base</label>
                    <input
                      type="number"
                      name="costoBase"
                      value={formData.costoBase}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      step="0.01"
                      required
                      disabled={loadingModal}
                    />
                  </div>
				  <div>
					  <label className="block text-sm font-medium text-gray-700">Método</label>
					  <input
						type="text"
						name="metodo"
						value={formData.metodo}
						onChange={handleInputChange}
						className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						required
						disabled={loadingModal}
					  />
				  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Puntadas Estimadas</label>
                    <input
                      type="number"
                      name="numPuntadasEstimadas"
                      value={formData.numPuntadasEstimadas}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Colores</label>
                    <input
                      type="number"
                      name="numColores"
                      value={formData.numColores}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Programa Ponchado</label>
                    <input
                      type="number"
                      name="costoProgramaPonchado"
                      value={formData.costoProgramaPonchado}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      step="0.01"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Factor de Complejidad</label>
                  <input
                    type="text"
                    name="factorComplejidad"
                    value={formData.factorComplejidad}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    disabled={loadingModal}
                  />
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
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    isEditMode ? 'Guardar Cambios' : 'Crear Ítem'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <TrashIcon className="mx-auto h-16 w-16 text-red-500" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">¿Estás seguro?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Estás a punto de eliminar la personalización: <span className="font-semibold">{currentItem?.nombre}</span>. Esta acción no se puede deshacer.
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
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizacionesCatalogPage;
