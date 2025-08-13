import React from 'react';

/**
 * Componente ConfirmationModal.
 *
 * Un modal genérico para solicitar confirmación al usuario antes de realizar una acción.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {boolean} props.isOpen - Si el modal está abierto o cerrado.
 * @param {function} props.onClose - Función para cerrar el modal (cancelar).
 * @param {function} props.onConfirm - Función para ejecutar cuando se confirma la acción.
 * @param {string} props.title - El título del modal.
 * @param {string} props.message - El mensaje de confirmación.
 * @returns {JSX.Element | null} El elemento JSX del modal de confirmación o null si no está abierto.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
