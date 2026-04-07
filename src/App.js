// Autor: Ing. Miguel Mota
// Fecha de Creación: 2025-08-20 22:30
// Nombre del Archivo: App.js (Control de cambio y secuencia N° 014: Corrección de advertencias de compilación)

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import IAAdvisorButton from './components/ia/IAAdvisorButton';
import Notification from './components/common/Notification';
import LoginPage from './LoginPage';
import { useAuth, PrivateRoute } from './AuthContext'; // Importamos useAuth y PrivateRoute

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

/**
 * Componente principal de la aplicación.
 * @returns {JSX.Element} El elemento JSX de la aplicación.
 */
const App = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

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
            {/* Ruta para el inicio de sesión */}
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={login} />}
            />

            {/* Rutas privadas */}
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
            <Route path="/budgets" element={<PrivateRoute><BudgetsPage /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            
            {/* Rutas de catálogos */}
            <Route path="/catalogos/telas" element={<PrivateRoute><TelasCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
            <Route path="/catalogos/disenos-modelos" element={<PrivateRoute><DisenosModelosCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
            <Route path="/catalogos/tipos-corte" element={<PrivateRoute><TipoCortesCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
            <Route path="/catalogos/personalizaciones" element={<PrivateRoute><PersonalizacionesCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
            <Route path="/catalogos/clientes" element={<PrivateRoute><ClientesCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
            <Route path="/catalogos/config-global" element={<PrivateRoute><ConfigGlobalCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
            <Route path="/catalogos/acabados-especiales" element={<PrivateRoute><AcabadosEspecialesCatalogPage userToken={useAuth().userToken} /></PrivateRoute>} />
			<Route path="/catalogos/usuarios" element={<PrivateRoute><UsuariosCatalogPage userToken={useAuth().userToken} currentUserRole={useAuth().currentUserRole} /></PrivateRoute>
  }
/>

            {/* Rutas para los sub-ítems de Ajustes */}
            <Route
              path="/settings/*"
              element={
                <PrivateRoute>
                  <SettingsPage showNotification={showNotification} />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings/user-management"
              element={
                <PrivateRoute>
                  <UserManagementPage userToken={useAuth().userToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings/change-password"
              element={
                <PrivateRoute>
                  <ChangePasswordPage userToken={useAuth().userToken} />
                </PrivateRoute>
              }
            />

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>

      {/* El botón del Asesor de IA solo se muestra si el usuario está autenticado */}
      {isAuthenticated && <IAAdvisorButton />}

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

export default App;
