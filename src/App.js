// Autor: Ing. Miguel Mota
// Fecha de Creación: 31/07/2025 08:30
// Nombre del Archivo: App.js (Control de cambio y secuencia N° 012: Corrección de errores de importación y enrutamiento)

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import IAAdvisorButton from './components/ia/IAAdvisorButton';
import Notification from './components/common/Notification';
import LoginPage from './LoginPage';

// Importa las páginas existentes
import DashboardPage from './DashboardPage';
import TransactionsPage from './TransactionsPage';
import BudgetsPage from './BudgetsPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import NotFoundPage from './NotFoundPage';
import GenericCatalogManager from './GenericCatalogManager';

// Importa las páginas específicas de catálogos
import TelasCatalogPage from './TelasCatalogPage';
import DisenosModelosCatalogPage from './DisenosModelosCatalogPage';
import TipoCortesCatalogPage from './TipoCortesCatalogPage';
import PersonalizacionesCatalogPage from './PersonalizacionesCatalogPage';
import ClientesCatalogPage from './ClientesCatalogPage';
import ConfigGlobalCatalogPage from './ConfigGlobalCatalogPage';
import AcabadosEspecialesCatalogPage from './AcabadosEspecialesCatalogPage';
import UsuariosCatalogPage from './UsuariosCatalogPage';

// Importa las páginas para los sub-ítems de Ajustes
import UserManagementPage from './UserManagementPage';
import ChangePasswordPage from './ChangePasswordPage';

/**
 * Componente principal de la aplicación.
 *
 * Configura el enrutamiento, la estructura general (Header, Sidebar)
 * y gestiona los estados globales como las notificaciones y la visibilidad de la barra lateral.
 */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [notification, setNotification] = useState(null);

  // Función para manejar el éxito del login
  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    setUserToken(token);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserToken(null);
    // Limpiar localStorage si se usó
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  /**
   * Componente auxiliar para rutas privadas.
   * Se define dentro de App para no necesitar un archivo separado.
   */
  const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Renderiza la barra lateral solo si el usuario está autenticado */}
      {isAuthenticated && (
        <Sidebar
          isSidebarOpen={isSidebarVisible}
          onLogout={handleLogout}
          toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        />
      )}

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isAuthenticated && isSidebarVisible ? 'md:ml-64' : 'ml-0'
        }`}
      >
        {/* El Header se renderiza siempre, pero sus elementos internos pueden depender de la autenticación */}
        <Header
          isAuthenticated={isAuthenticated}
          toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        />

        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            {/* Ruta de Login, sin protección */}
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Rutas principales de la aplicación, protegidas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <TransactionsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/budgets"
              element={
                <PrivateRoute>
                  <BudgetsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />

            {/* Rutas para los catálogos */}
            <Route
              path="/catalogos/telas"
              element={
                <PrivateRoute>
                  <TelasCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/catalogos/disenos-modelos"
              element={
                <PrivateRoute>
                  <DisenosModelosCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
			<Route
              path="/catalogos/tipos-corte"
              element={
                <PrivateRoute>
                  <TipoCortesCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/catalogos/personalizaciones"
              element={
                <PrivateRoute>
                  <PersonalizacionesCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
			<Route
              path="/catalogos/clientes"
              element={
                <PrivateRoute>
                  <ClientesCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
			<Route
              path="/catalogos/configGlobal"
              element={
                <PrivateRoute>
                  <ConfigGlobalCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/catalogos/acabados-especiales"
              element={
                <PrivateRoute>
                  <AcabadosEspecialesCatalogPage userToken={userToken} />
                </PrivateRoute>
              }
            />
			<Route
              path="/catalogos/usuarios"
              element={
                <PrivateRoute>
                  <UsuariosCatalogPage userToken={userToken} />
                </PrivateRoute>
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
                  <UserManagementPage userToken={userToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings/change-password"
              element={
                <PrivateRoute>
                  <ChangePasswordPage userToken={userToken} />
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
