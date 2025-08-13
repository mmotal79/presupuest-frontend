import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Iconos para acciones
import Modal from './components/common/Modal'; // Asumo que tienes un componente Modal
import Notification from './components/common/Notification'; // Asumo que tienes un componente Notification
import ConfirmationModal from './components/common/ConfirmationModal'; // Importa el modal de confirmación

/**
 * Componente GenericCatalogManager.
 *
 * Muestra una lista de elementos de un catálogo específico, permite añadir, editar y eliminar elementos
 * interactuando con un backend RESTful.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.apiBaseUrl - La URL base de la API para este catálogo específico (ej. 'http://localhost:3001/api/catalogos/telas').
 * @param {string} props.catalogTitle - El título a mostrar para este catálogo (ej. 'Catálogo de Telas').
 * @returns {JSX.Element} El elemento JSX de la página de gestión de catálogos.
 */
const GenericCatalogManager = ({ apiBaseUrl, catalogTitle }) => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Para editar o ver detalles
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Nuevo estado para el modal de confirmación de eliminación
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  /**
   * Muestra una notificación temporal.
   * @param {string} message - El mensaje de la notificación.
   * @param {'success' | 'error' | 'info'} type - El tipo de notificación.
   */
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // La notificación desaparece después de 3 segundos
  }, []); // showNotification no tiene dependencias que cambien, así que es estable

  /**
   * Carga los elementos del catálogo desde el backend.
   * Envuelto en useCallback para estabilidad y para ser una dependencia de useEffect.
   */
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(apiBaseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(`Error al cargar los elementos de ${catalogTitle}:`, err);
      setError(`No se pudieron cargar los elementos de ${catalogTitle}. Inténtalo de nuevo.`);
      showNotification(`Error al cargar los elementos de ${catalogTitle}.`, "error");
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, catalogTitle, showNotification]); // Dependencias de useCallback para fetchItems

  // Cargar elementos al montar el componente o cuando cambie la URL base o la función fetchItems
  useEffect(() => {
    fetchItems();
  }, [fetchItems]); // Ahora fetchItems es una dependencia estable gracias a useCallback

  /**
   * Abre el modal para añadir un nuevo elemento.
   */
  const handleAddClick = () => {
    setCurrentItem(null);
    setItemName('');
    setItemDescription('');
    setIsModalOpen(true);
  };

  /**
   * Abre el modal para editar un elemento existente.
   * @param {object} item - El objeto elemento a editar.
   */
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setItemName(item.name);
    setItemDescription(item.description);
    setIsModalOpen(true);
  };

  /**
   * Guarda un nuevo elemento o actualiza uno existente en el backend.
   */
  const handleSaveItem = async () => {
    if (!itemName.trim()) {
      showNotification('El nombre del elemento no puede estar vacío.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);

    const itemData = {
      name: itemName,
      description: itemDescription,
    };

    try {
      let response;
      if (currentItem) {
        // Actualizar elemento existente
        response = await fetch(`${apiBaseUrl}/${currentItem._id}`, {
          method: 'PUT', // O 'PATCH' si tu API lo prefiere para actualizaciones parciales
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        showNotification(`${catalogTitle} actualizado con éxito.`, 'success');
      } else {
        // Añadir nuevo elemento
        response = await fetch(apiBaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        showNotification(`${catalogTitle} añadido con éxito.`, 'success');
      }
      setIsModalOpen(false);
      await fetchItems(); // Recargar la lista de elementos
    } catch (err) {
      console.error(`Error al guardar el elemento de ${catalogTitle}:`, err);
      setError(`Error al guardar el elemento de ${catalogTitle}. Inténtalo de nuevo.`);
      showNotification(`Error al guardar el elemento de ${catalogTitle}.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Abre el modal de confirmación para eliminar un elemento.
   * @param {string} id - El ID del elemento a eliminar.
   */
  const handleConfirmDelete = (id) => {
    setItemToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  /**
   * Elimina un elemento del catálogo del backend después de la confirmación.
   */
  const handleDeleteItem = async () => {
    setIsConfirmModalOpen(false); // Cierra el modal de confirmación
    if (!itemToDeleteId) return; // Si no hay ID, no hacer nada

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/${itemToDeleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      showNotification(`${catalogTitle} eliminado con éxito.`, 'success');
      await fetchItems(); // Recargar la lista de elementos
    } catch (err) {
      console.error(`Error al eliminar el elemento de ${catalogTitle}:`, err);
      setError(`Error al eliminar el elemento de ${catalogTitle}. Inténtalo de nuevo.`);
      showNotification(`Error al eliminar el elemento de ${catalogTitle}.`, "error");
    } finally {
      setIsLoading(false);
      setItemToDeleteId(null); // Limpiar el ID del elemento a eliminar
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{catalogTitle}</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out shadow-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Añadir Elemento
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-700 text-lg">Cargando elementos de {catalogTitle}...</p>
          {/* Puedes añadir un spinner aquí si lo deseas */}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No hay elementos disponibles en {catalogTitle}. ¡Añade uno nuevo!</p>
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-shadow duration-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                  title="Editar Elemento"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleConfirmDelete(item._id)}
                  className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                  title="Eliminar Elemento"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para añadir/editar elemento */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentItem ? `Editar Elemento de ${catalogTitle}` : `Añadir Nuevo Elemento a ${catalogTitle}`}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
              Nombre del Elemento
            </label>
            <input
              type="text"
              id="itemName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="itemDescription"
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveItem}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentItem ? 'Guardar Cambios' : 'Añadir Elemento'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setItemToDeleteId(null);
        }}
        onConfirm={handleDeleteItem}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
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

export default GenericCatalogManager;
