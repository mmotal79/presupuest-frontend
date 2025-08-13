import React, { useState } from 'react';
import Notification from '../common/Notification'; // Asegúrate de que esta ruta sea correcta

/**
 * Componente IAAdvisorButton
 *
 * Este componente representa un botón flotante para el futuro asesor de IA.
 * Actualmente, muestra un mensaje de notificación indicando que la funcionalidad
 * está en desarrollo.
 *
 * Se ha simplificado el icono SVG para evitar problemas de renderizado
 * o cuelgues debido a la complejidad de la ruta.
 *
 * @returns {JSX.Element} El elemento JSX del botón del asesor de IA.
 */
const IAAdvisorButton = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleClick = () => {
    setNotification({
      message: "Funcionalidad de Asesor de IA en desarrollo. ¡Próximamente disponible para optimizar sus presupuestos!",
      type: 'info' // Puedes cambiar a 'warning', 'success', etc.
    });
    // En el futuro, aquí se integraría la lógica para abrir el chat o panel del asesor IA
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-full shadow-lg flex items-center space-x-2 transition-colors duration-200 opacity-50 cursor-not-allowed z-50"
        disabled // Deshabilitado por defecto hasta su implementación
        title="Asesor de IA (Próximamente)"
      >
        {/* Icono de IA/Asesor (ejemplo con SVG simple de un chip/procesador) */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Rectángulo principal del chip */}
          <rect x="5" y="5" width="14" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></rect>
          {/* Patas/conexiones superiores */}
          <line x1="9" y1="1" x2="9" y2="5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          <line x1="15" y1="1" x2="15" y2="5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          {/* Patas/conexiones inferiores */}
          <line x1="9" y1="19" x2="9" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          <line x1="15" y1="19" x2="15" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          {/* Patas/conexiones izquierdas */}
          <line x1="1" y1="9" x2="5" y2="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          <line x1="1" y1="15" x2="5" y2="15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          {/* Patas/conexiones derechas */}
          <line x1="19" y1="9" x2="23" y2="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
          <line x1="19" y1="15" x2="23" y2="15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
        </svg>
        <span>Asesor IA</span>
      </button>

      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </>
  );
};

export default IAAdvisorButton;
