// Autor: Ing. Miguel Mota
// Fecha de Creación: 02/08/2025
// Nombre del Archivo: ConfigGlobalCatalogPage.js (Control de cambio y secuencia N° 001: Implementación de CRUD para Catálogo de Configuración Global)

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
 * Componente para gestionar el catálogo de Configuración Global.
 * Muestra la configuración actual y permite las operaciones de CRUD sobre ella.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.userToken - Token de autenticación del usuario, necesario para las operaciones CRUD.
 * @returns {JSX.Element} Elemento JSX que representa la página del catálogo.
 */
const ConfigGlobalCatalogPage = ({ userToken }) => {
  // URL base de la API para este catálogo
  const apiBaseUrl = "http://localhost:3001/api/catalogos/config-global";
  const catalogTitle = "Catálogo de Configuración Global";

  // Estados para la gestión de datos y UI
  const [config, setConfig] = useState(null);
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
    nombreConfig: '',
    impuestoIVA: 0,
    margenGanancia: 0,
    costoPlanchadoUnidad: 0,
    costoEmpaqueUnidad: 0,
    costoDisenoGraficoBase: 0,
    costoMuestraFisicaBase: 0,
    factoresVolumen: [],
    opcionesEmpaque: [],
    factoresUrgencia: [],
  });

  /**
   * Carga los datos de la configuración global desde la API.
   * Utiliza useCallback para memorizar la función y optimizar el rendimiento.
   */
  const fetchConfig = useCallback(async () => {
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
        throw new Error('Error al obtener la configuración global.');
      }
      const data = await response.json();
      // El endpoint puede devolver un array o un único objeto
      const configData = Array.isArray(data) ? data[0] : data;
      setConfig(configData);
    } catch (err) {
      console.error("Error fetching config:", err);
      setError('No se pudo cargar la configuración. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /**
   * Muestra una notificación temporal.
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
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  /**
   * Abre el modal para crear o editar la configuración.
   */
  const handleOpenModal = (isEditing = false) => {
    setIsEditMode(isEditing);
    if (isEditing && config) {
      setFormData({
        nombreConfig: config.nombreConfig || '',
        impuestoIVA: config.impuestoIVA || 0,
        margenGanancia: config.margenGanancia || 0,
        costoPlanchadoUnidad: config.costoPlanchadoUnidad || 0,
        costoEmpaqueUnidad: config.costoEmpaqueUnidad || 0,
        costoDisenoGraficoBase: config.costoDisenoGraficoBase || 0,
        costoMuestraFisicaBase: config.costoMuestraFisicaBase || 0,
        factoresVolumen: config.factoresVolumen || [],
        opcionesEmpaque: config.opcionesEmpaque || [],
        factoresUrgencia: config.factoresUrgencia || [],
      });
      setCurrentItem(config);
    } else {
      setFormData({
        nombreConfig: 'Configuracion Inicial',
        impuestoIVA: 0.16,
        margenGanancia: 0.25,
        costoPlanchadoUnidad: 0.5,
        costoEmpaqueUnidad: 0.15,
        costoDisenoGraficoBase: 50,
        costoMuestraFisicaBase: 25,
        factoresVolumen: [],
        opcionesEmpaque: [],
        factoresUrgencia: [],
      });
      setCurrentItem(null);
    }
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
   * Abre el modal de confirmación para eliminar la configuración.
   */
  const handleOpenDeleteModal = () => {
    setCurrentItem(config);
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
   * Confirma la eliminación de la configuración.
   */
  const confirmDeleteItem = async () => {
    if (!config || !config._id) {
      showNotification('Error: Ítem no válido para eliminar.', 'error');
      return;
    }

    setLoadingModal(true);
    try {
      const headers = {
        'Authorization': `Bearer ${userToken}`,
      };
      const response = await fetch(`${apiBaseUrl}/${config._id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ítem.');
      }

      showNotification('Configuración eliminada con éxito', 'success');
      setConfig(null); // Limpiar la configuración
    } catch (err) {
      showNotification('Error al eliminar la configuración: ' + err.message, 'error');
      console.error("Error deleting item:", err);
    } finally {
      setLoadingModal(false);
      handleCloseDeleteModal();
    }
  };

  /**
   * Guarda una nueva configuración o actualiza la existente.
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
        throw new Error(errorData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la configuración.`);
      }

      showNotification(`Configuración ${isEditMode ? 'actualizada' : 'creada'} con éxito`, 'success');
      fetchConfig(); // Recargar la configuración
      handleCloseModal();
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
      console.error("Error saving item:", err);
    } finally {
      setLoadingModal(false);
    }
  };

  // Manejadores para los arreglos anidados
  const handleNestedArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = { ...newArray[index], [field]: parseFloat(value) || value };
    setFormData(prevData => ({ ...prevData, [arrayName]: newArray }));
  };

  const handleAddNestedItem = (arrayName, newItem) => {
    setFormData(prevData => ({ ...prevData, [arrayName]: [...prevData[arrayName], { ...newItem, _id: uuidv4() }] }));
  };

  const handleRemoveNestedItem = (arrayName, id) => {
    setFormData(prevData => ({ ...prevData, [arrayName]: prevData[arrayName].filter(item => item._id !== id) }));
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
        {config ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
            >
              <PencilSquareIcon className="h-6 w-6" />
              <span>Editar Configuración</span>
            </button>
            <button
              onClick={handleOpenDeleteModal}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 flex items-center space-x-2"
            >
              <TrashIcon className="h-6 w-6" />
              <span>Eliminar</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleOpenModal(false)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
          >
            <PlusCircleIcon className="h-6 w-6" />
            <span>Crear Configuración</span>
          </button>
        )}
      </div>

      {config ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Detalles de la Configuración</h2>
              <p><strong>Nombre:</strong> {config.nombreConfig}</p>
              <p><strong>Impuesto (IVA):</strong> {config.impuestoIVA * 100}%</p>
              <p><strong>Margen de Ganancia:</strong> {config.margenGanancia * 100}%</p>
              <p><strong>Costo Planchado por Unidad:</strong> ${config.costoPlanchadoUnidad.toFixed(2)}</p>
              <p><strong>Costo Empaque por Unidad:</strong> ${config.costoEmpaqueUnidad.toFixed(2)}</p>
              <p><strong>Costo Diseño Gráfico Base:</strong> ${config.costoDisenoGraficoBase.toFixed(2)}</p>
              <p><strong>Costo Muestra Física Base:</strong> ${config.costoMuestraFisicaBase.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Factores por Volumen</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Max</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {config.factoresVolumen.map((f, index) => (
                    <tr key={f._id || index}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{f.min}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{f.max}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{f.factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Opciones de Empaque</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {config.opcionesEmpaque.map((o, index) => (
                    <tr key={o._id || index}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{o.nombre}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">${o.costo.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Factores de Urgencia</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {config.factoresUrgencia.map((f, index) => (
                    <tr key={f._id || index}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{f.tipo}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{f.factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <InformationCircleIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay configuración global</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se ha creado una configuración global. Presiona el botón para agregar una.
          </p>
        </div>
      )}

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loadingModal}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditMode ? 'Editar Configuración' : 'Nueva Configuración'}
            </h3>
            <form onSubmit={handleSaveItem}>
              <div className="space-y-4">
                {/* Campos principales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de la Configuración</label>
                  <input
                    type="text"
                    name="nombreConfig"
                    value={formData.nombreConfig}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    disabled={loadingModal}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Impuesto IVA (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="impuestoIVA"
                      value={formData.impuestoIVA}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Margen de Ganancia (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="margenGanancia"
                      value={formData.margenGanancia}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Planchado Unidad ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="costoPlanchadoUnidad"
                      value={formData.costoPlanchadoUnidad}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Empaque Unidad ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="costoEmpaqueUnidad"
                      value={formData.costoEmpaqueUnidad}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Diseño Gráfico Base ($)</label>
                    <input
                      type="number"
                      step="1"
                      name="costoDisenoGraficoBase"
                      value={formData.costoDisenoGraficoBase}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Muestra Física Base ($)</label>
                    <input
                      type="number"
                      step="1"
                      name="costoMuestraFisicaBase"
                      value={formData.costoMuestraFisicaBase}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={loadingModal}
                    />
                  </div>
                </div>

                {/* Secciones para arreglos anidados */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <h4 className="font-bold mb-2">Factores por Volumen</h4>
                    {formData.factoresVolumen.map((factor, index) => (
                      <div key={factor._id || index} className="flex space-x-2 mb-2 items-center">
                        <input
                          type="number"
                          value={factor.min}
                          onChange={(e) => handleNestedArrayChange('factoresVolumen', index, 'min', e.target.value)}
                          className="w-1/4 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <input
                          type="number"
                          value={factor.max}
                          onChange={(e) => handleNestedArrayChange('factoresVolumen', index, 'max', e.target.value)}
                          className="w-1/4 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={factor.factor}
                          onChange={(e) => handleNestedArrayChange('factoresVolumen', index, 'factor', e.target.value)}
                          className="w-1/4 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <button type="button" onClick={() => handleRemoveNestedItem('factoresVolumen', factor._id)}>
                          <TrashIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('factoresVolumen', { min: 0, max: 0, factor: 1 })}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Añadir Factor
                    </button>
                  </div>

                  <div className="p-4 border border-gray-300 rounded-lg">
                    <h4 className="font-bold mb-2">Opciones de Empaque</h4>
                    {formData.opcionesEmpaque.map((opcion, index) => (
                      <div key={opcion._id || index} className="flex space-x-2 mb-2 items-center">
                        <input
                          type="text"
                          value={opcion.nombre}
                          onChange={(e) => handleNestedArrayChange('opcionesEmpaque', index, 'nombre', e.target.value)}
                          className="w-1/2 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={opcion.costo}
                          onChange={(e) => handleNestedArrayChange('opcionesEmpaque', index, 'costo', e.target.value)}
                          className="w-1/2 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <button type="button" onClick={() => handleRemoveNestedItem('opcionesEmpaque', opcion._id)}>
                          <TrashIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('opcionesEmpaque', { nombre: '', costo: 0 })}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Añadir Opción
                    </button>
                  </div>

                  <div className="p-4 border border-gray-300 rounded-lg">
                    <h4 className="font-bold mb-2">Factores de Urgencia</h4>
                    {formData.factoresUrgencia.map((factor, index) => (
                      <div key={factor._id || index} className="flex space-x-2 mb-2 items-center">
                        <input
                          type="text"
                          value={factor.tipo}
                          onChange={(e) => handleNestedArrayChange('factoresUrgencia', index, 'tipo', e.target.value)}
                          className="w-1/2 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={factor.factor}
                          onChange={(e) => handleNestedArrayChange('factoresUrgencia', index, 'factor', e.target.value)}
                          className="w-1/2 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                          disabled={loadingModal}
                        />
                        <button type="button" onClick={() => handleRemoveNestedItem('factoresUrgencia', factor._id)}>
                          <TrashIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('factoresUrgencia', { tipo: '', factor: 1 })}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Añadir Factor
                    </button>
                  </div>
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
                    isEditMode ? 'Guardar Cambios' : 'Crear Configuración'
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
              Estás a punto de eliminar la configuración: <span className="font-semibold">{currentItem?.nombreConfig}</span>. Esta acción no se puede deshacer.
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

export default ConfigGlobalCatalogPage;
