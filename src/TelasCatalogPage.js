// Autor: Ing. Miguel Mota
// Fecha de Creación: 31/07/2025 08:00
// Nombre del Archivo: TelasCatalogPage.js (Nuevo 31/07/2025 N° 001: Implementación CRUD para Catálogo de Telas)

import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PlusCircleIcon, PencilSquareIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Iconos para acciones
import Modal from './components/common/Modal'; // Asumo que tienes un componente Modal
import Notification from './components/common/Notification'; // Asumo que tienes un componente Notification
import ConfirmationModal from './components/common/ConfirmationModal'; // Asumo que tienes un componente ConfirmationModal

/**
 * Componente TelasCatalogPage.
 *
 * Muestra una lista de elementos de telas, permite añadir, editar y eliminar telas
 * interactuando con un backend RESTful y utilizando un token de autenticación.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.userToken - El token de autenticación del usuario.
 * @returns {JSX.Element} El elemento JSX de la página de gestión de catálogos de telas.
 */
const TelasCatalogPage = ({ userToken }) => {
  const [telas, setTelas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTela, setCurrentTela] = useState(null); // Para editar o ver detalles
  const [formData, setFormData] = useState({
    nombre: '',
    composicion: '', // Se manejará como string separado por comas en el formulario
    gramaje: '',
    propiedades: '', // Se manejará como string separado por comas en el formulario
    costoPorUnidad: '',
    unidadMedida: '',
    anchoTelaMetros: '',
  });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Nuevo estado para el modal de confirmación de eliminación
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [telaToDeleteId, setTelaToDeleteId] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api/catalogos/telas';
  const CATALOG_TITLE = 'Catálogo de Telas';

  /**
   * Muestra una notificación temporal.
   * @param {string} message - El mensaje de la notificación.
   * @param {'success' | 'error' | 'info'} type - El tipo de notificación.
   */
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  /**
   * Carga los elementos de telas desde el backend.
   * Envuelto en useCallback para estabilidad y para ser una dependencia de useEffect.
   */
  const fetchTelas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${userToken}`, // Incluye el token de autenticación
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('No autorizado. Por favor, inicia sesión de nuevo.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTelas(data);
    } catch (err) {
      console.error(`Error al cargar las telas de ${CATALOG_TITLE}:`, err);
      setError(`No se pudieron cargar las telas de ${CATALOG_TITLE}. ${err.message}`);
      showNotification(`Error al cargar las telas de ${CATALOG_TITLE}.`, "error");
    } finally {
      setIsLoading(false);
    }
  }, [userToken, showNotification]); // userToken es una dependencia crucial aquí

  // Cargar telas al montar el componente o cuando cambie el token del usuario
  useEffect(() => {
    if (userToken) { // Solo intenta cargar si hay un token
      fetchTelas();
    } else {
      setIsLoading(false);
      setError("No hay token de autenticación. Por favor, inicia sesión.");
      showNotification("No hay token de autenticación. Por favor, inicia sesión.", "error");
    }
  }, [userToken, fetchTelas]); // fetchTelas es una dependencia estable gracias a useCallback

  /**
   * Maneja el cambio en los campos del formulario.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Abre el modal para añadir una nueva tela.
   */
  const handleAddClick = () => {
    setCurrentTela(null);
    setFormData({
      nombre: '',
      composicion: '',
      gramaje: '',
      propiedades: '',
      costoPorUnidad: '',
      unidadMedida: '',
      anchoTelaMetros: '',
    });
    setIsModalOpen(true);
  };

  /**
   * Abre el modal para editar una tela existente.
   * @param {object} tela - El objeto tela a editar.
   */
  const handleEditClick = (tela) => {
    setCurrentTela(tela);
    setFormData({
      nombre: tela.nombre || '',
      composicion: Array.isArray(tela.composicion) ? tela.composicion.join(', ') : '',
      gramaje: tela.gramaje || '',
      propiedades: Array.isArray(tela.propiedades) ? tela.propiedades.join(', ') : '',
      costoPorUnidad: tela.costoPorUnidad || '',
      unidadMedida: tela.unidadMedida || '',
      anchoTelaMetros: tela.anchoTelaMetros || '',
    });
    setIsModalOpen(true);
  };

  /**
   * Guarda una nueva tela o actualiza una existente en el backend.
   */
  const handleSaveTela = async () => {
    if (!formData.nombre.trim() || !formData.composicion.trim() || !formData.gramaje || !formData.costoPorUnidad || !formData.unidadMedida || !formData.anchoTelaMetros) {
      showNotification('Todos los campos obligatorios deben ser completados.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Preparar los datos para enviar al backend
    const telaData = {
      nombre: formData.nombre.trim(),
      composicion: formData.composicion.split(',').map(s => s.trim()).filter(s => s),
      gramaje: parseFloat(formData.gramaje),
      propiedades: formData.propiedades.split(',').map(s => s.trim()).filter(s => s),
      costoPorUnidad: parseFloat(formData.costoPorUnidad),
      unidadMedida: formData.unidadMedida.trim(),
      anchoTelaMetros: parseFloat(formData.anchoTelaMetros),
    };

    try {
      let response;
      if (currentTela) {
        // Actualizar tela existente
        response = await fetch(`${API_BASE_URL}/${currentTela._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`, // Incluye el token
          },
          body: JSON.stringify(telaData),
        });
      } else {
        // Añadir nueva tela
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`, // Incluye el token
          },
          body: JSON.stringify(telaData),
        });
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('No autorizado. Por favor, inicia sesión de nuevo.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      showNotification(`${CATALOG_TITLE} ${currentTela ? 'actualizada' : 'añadida'} con éxito.`, 'success');
      setIsModalOpen(false);
      await fetchTelas(); // Recargar la lista de telas
    } catch (err) {
      console.error(`Error al guardar la tela de ${CATALOG_TITLE}:`, err);
      setError(`Error al guardar la tela de ${CATALOG_TITLE}. ${err.message}`);
      showNotification(`Error al guardar la tela de ${CATALOG_TITLE}.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Abre el modal de confirmación para eliminar una tela.
   * @param {string} id - El ID de la tela a eliminar.
   */
  const handleConfirmDelete = (id) => {
    setTelaToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  /**
   * Elimina una tela del backend después de la confirmación.
   */
  const handleDeleteTela = async () => {
    setIsConfirmModalOpen(false); // Cierra el modal de confirmación
    if (!telaToDeleteId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${telaToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`, // Incluye el token
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('No autorizado. Por favor, inicia sesión de nuevo.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      showNotification(`${CATALOG_TITLE} eliminada con éxito.`, 'success');
      await fetchTelas(); // Recargar la lista de telas
    } catch (err) {
      console.error(`Error al eliminar la tela de ${CATALOG_TITLE}:`, err);
      setError(`Error al eliminar la tela de ${CATALOG_TITLE}. ${err.message}`);
      showNotification(`Error al eliminar la tela de ${CATALOG_TITLE}.`, "error");
    } finally {
      setIsLoading(false);
      setTelaToDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen flex justify-center items-center">
        <p className="text-gray-700 text-lg">Cargando {CATALOG_TITLE}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md min-h-screen">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{CATALOG_TITLE}</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out shadow-md"
        >
		<PlusCircleIcon className="h-6 w-6" />
          <span>Añadir Tipo de Tela</span>
        </button>
      </div>

      {telas.length === 0 ? (
        <div className="text-center py-8 bg-white border border-gray-200 rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No hay telas disponibles. ¡Añade una tela nueva!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Composición
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Gramaje
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Propiedades
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Costo/Unidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Unidad Medida
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Ancho (m)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Fecha Actualización
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {telas.map((tela) => (
                <tr key={tela._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tela.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Array.isArray(tela.composicion) ? tela.composicion.join(', ') : tela.composicion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tela.gramaje}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Array.isArray(tela.propiedades) ? tela.propiedades.join(', ') : tela.propiedades}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tela.costoPorUnidad ? tela.costoPorUnidad.toFixed(2) : '0.00'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tela.unidadMedida}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tela.anchoTelaMetros}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tela.fechaCreacion ? new Date(tela.fechaCreacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tela.fechaActualizacion ? new Date(tela.fechaActualizacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(tela)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-300"
                      title="Editar Tela"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(tela._id)}
                      className="text-red-600 hover:text-red-900 transition duration-300"
                      title="Eliminar Tela"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Añadir/Editar Tela */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTela ? `Editar Tela: ${currentTela.nombre}` : 'Añadir Nueva Tela'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre de la Tela
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="composicion" className="block text-sm font-medium text-gray-700">
              Composición (separado por comas)
            </label>
            <input
              type="text"
              id="composicion"
              name="composicion"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.composicion}
              onChange={handleChange}
              placeholder="Ej: Algodón, Poliéster"
              required
            />
          </div>
          <div>
            <label htmlFor="gramaje" className="block text-sm font-medium text-gray-700">
              Gramaje
            </label>
            <input
              type="number"
              id="gramaje"
              name="gramaje"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.gramaje}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="propiedades" className="block text-sm font-medium text-gray-700">
              Propiedades (separado por comas)
            </label>
            <input
              type="text"
              id="propiedades"
              name="propiedades"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.propiedades}
              onChange={handleChange}
              placeholder="Ej: Suave, Respirable"
            />
          </div>
          <div>
            <label htmlFor="costoPorUnidad" className="block text-sm font-medium text-gray-700">
              Costo por Unidad
            </label>
            <input
              type="number"
              id="costoPorUnidad"
              name="costoPorUnidad"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.costoPorUnidad}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="unidadMedida" className="block text-sm font-medium text-gray-700">
              Unidad de Medida
            </label>
            <input
              type="text"
              id="unidadMedida"
              name="unidadMedida"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.unidadMedida}
              onChange={handleChange}
              placeholder="Ej: metro, yarda"
              required
            />
          </div>
          <div>
            <label htmlFor="anchoTelaMetros" className="block text-sm font-medium text-gray-700">
              Ancho de Tela (metros)
            </label>
            <input
              type="number"
              id="anchoTelaMetros"
              name="anchoTelaMetros"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.anchoTelaMetros}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveTela}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentTela ? 'Guardar Cambios' : 'Añadir Tela'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setTelaToDeleteId(null);
        }}
        onConfirm={handleDeleteTela}
        title="Confirmar Eliminación de Tela"
        message="¿Estás seguro de que deseas eliminar esta tela? Esta acción no se puede deshacer."
      />

      {/* Componente de Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default TelasCatalogPage;
