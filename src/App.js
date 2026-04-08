// Autor: Ing. Miguel Mota
// Fecha de Creación: 2025-08-20 22:30
// Nombre del Archivo: App.js (Control de cambio y secuencia N° 015: Optimización de Props de Autenticación)

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import IAAdvisorButton from './components/ia/IAAdvisorButton';
import Notification from './components/common/Notification';
import LoginPage from './LoginPage';
import { useAuth, PrivateRoute } from './AuthContext';

// Importa las páginas existentes
import DashboardPage from './DashboardPage';
import TransactionsPage from './TransactionsPage';
import BudgetsPage from './BudgetsPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import NotFoundPage from './NotFoundPage';

// Importa las páginas específicas de catálogos
import TelasCatalogPage from './TelasCatalogPage';
import DisenosModelosCatalogPage from './DisenosModelosCatalogPage';
import TipoCortesCatalogPage from './TipoCortesCatalogPage';
import PersonalizacionesCatalogPage from './PersonalizacionesCatalogPage';
import ClientesCatalogPage from './ClientesCatalogPage';
import ConfigGlobalCatalogPage from './ConfigGlobalCatalogPage';
import AcabadosEspecialesCatalogPage from './AcabadosEspecialesCatalogPage';
import UsuariosCatalogPage from './UsuariosCatalogPage';

// Importa las páginas de ajustes
import UserManagementPage from './UserManagementPage';
import ChangePasswordPage from './ChangePasswordPage';

const App = () => {
  // Desestructuramos los valores necesarios de una vez
  const { isAuthenticated, logout, userToken, currentUser } = useAuth(); 
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthenticated && (
        <Sidebar isSidebarOpen={isSidebarOpen} onLogout={onLogout} />
      )}

      <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isAuthenticated ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        {isAuthenticated && (
          <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        )}

        <div className={`p-6 ${isAuthenticated ? 'mt-16' : ''}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas privadas con paso de tokens corregido */}
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
            <Route path="/budgets" element={<PrivateRoute><BudgetsPage /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            
            {/* Rutas de catálogos - Usamos las variables desestructuradas */}
            <Route path="/catalogos/telas" element={<PrivateRoute><TelasCatalogPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/catalogos/disenos-modelos" element={<PrivateRoute><DisenosModelosCatalogPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/catalogos/tipos-corte" element={<PrivateRoute><TipoCortesCatalogPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/catalogos/personalizaciones" element={<PrivateRoute><PersonalizacionesCatalogPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/catalogos/clientes" element={<PrivateRoute><ClientesCatalogPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/catalogos/config-global" element={<PrivateRoute><ConfigGlobalCatalogPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/catalogos/acabados-especiales" element={<PrivateRoute><AcabadosEspecialesCatalogPage userToken={userToken} /></PrivateRoute>} />
            
            {/* Corrección en Usuarios: Accedemos al rol dentro de currentUser */}
            <Route path="/catalogos/usuarios" element={
              <PrivateRoute>
                <UsuariosCatalogPage userToken={userToken} currentUserRole={currentUser?.role} />
              </PrivateRoute>
            } />

            <Route path="/settings/*" element={<PrivateRoute><SettingsPage showNotification={showNotification} /></PrivateRoute>} />
            <Route path="/settings/user-management" element={<PrivateRoute><UserManagementPage userToken={userToken} /></PrivateRoute>} />
            <Route path="/settings/change-password" element={<PrivateRoute><ChangePasswordPage userToken={userToken} /></PrivateRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>

      {isAuthenticated && <IAAdvisorButton />}

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

export default App;