import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // <-- Añadida esta importación

/**
 * Componente de Notificación.
 *
 * Muestra mensajes de notificación temporales en la parte superior derecha de la pantalla.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.message - El mensaje a mostrar en la notificación.
 * @param {'success' | 'error' | 'info'} props.type - El tipo de notificación (determina el color).
 * @param {function} props.onClose - Función para cerrar la notificación manualmente.
 * @returns {JSX.Element | null} El elemento JSX de la notificación o null si no hay mensaje.
 */
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // La notificación desaparece después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const baseClasses = "fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 transition-all duration-300 transform";
  let typeClasses = "";

  switch (type) {
    case 'success':
      typeClasses = "bg-green-500 text-white";
      break;
    case 'error':
      typeClasses = "bg-red-500 text-white";
      break;
    case 'info':
    default:
      typeClasses = "bg-blue-500 text-white";
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Cerrar notificación"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Notification;
