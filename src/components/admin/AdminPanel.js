import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserCRUD from './UserCRUD'; // Aún no creado, pero se importará aquí
import ClientCRUD from './ClientCRUD'; // Aún no creado
import TelaCRUD from './TelaCRUD'; // Aún no creado, pero será el primer CRUD de ejemplo
import DisenoModeloCRUD from './DisenoModeloCRUD'; // Aún no creado
import TipoCorteCRUD from './TipoCorteCRUD'; // Aún no creado
import PersonalizacionCRUD from './PersonalizacionCRUD'; // Aún no creado
import AcabadoEspecialCRUD from './AcabadoEspecialCRUD'; // Aún no creado
import ConfigGlobalCRUD from './ConfigGlobalCRUD'; // Aún no creado

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // Estado para la pestaña activa

  // Determina qué pestañas son visibles según el rol del usuario
  const getVisibleTabs = () => {
    const tabs = [
      { id: 'users', label: 'Usuarios', roles: ['admin'] },
      { id: 'clients', label: 'Clientes', roles: ['admin', 'gerente', 'asesor'] }, // Clientes pueden ser gestionados por asesores
      { id: 'telas', label: 'Telas', roles: ['admin', 'gerente'] },
      { id: 'disenoModelos', label: 'Diseños/Modelos', roles: ['admin', 'gerente'] },
      { id: 'tiposCorte', label: 'Tipos de Corte', roles: ['admin', 'gerente'] },
      { id: 'personalizaciones', label: 'Personalizaciones', roles: ['admin', 'gerente'] },
      { id: 'acabadosEspeciales', label: 'Acabados Especiales', roles: ['admin', 'gerente'] },
      { id: 'configGlobal', label: 'Configuración Global', roles: ['admin'] },
    ];

    if (!user) return []; // Si no hay usuario, no mostrar pestañas

    return tabs.filter(tab => tab.roles.some(role => user.rol === role));
  };

  const visibleTabs = getVisibleTabs();

  // Si el usuario no tiene acceso a la pestaña activa por defecto, redirigir a la primera que tenga acceso
  useState(() => {
    if (visibleTabs.length > 0 && !visibleTabs.some(tab => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [user, visibleTabs]);


  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Panel de Administración</h1>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {activeTab === 'users' && <UserCRUD />}
        {activeTab === 'clients' && <ClientCRUD />}
        {activeTab === 'telas' && <TelaCRUD />}
        {activeTab === 'disenoModelos' && <DisenoModeloCRUD />}
        {activeTab === 'tiposCorte' && <TipoCorteCRUD />}
        {activeTab === 'personalizaciones' && <PersonalizacionCRUD />}
        {activeTab === 'acabadosEspeciales' && <AcabadoEspecialCRUD />}
        {activeTab === 'configGlobal' && <ConfigGlobalCRUD />}
      </div>
    </div>
  );
};

export default AdminPanel;
 