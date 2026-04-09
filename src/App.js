// Autor: Ing. Miguel Mota
// Archivo: App.js (Modo Acceso Directo)

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import IAAdvisorButton from './components/ia/IAAdvisorButton';
import Notification from './components/common/Notification';
import { useAuth } from './AuthContext';

// Importa tus páginas
import DashboardPage from './DashboardPage';
// ... (manten todas tus importaciones de páginas igual que antes)

const App = () => {
  const { currentUser, userToken, isAuthenticated } = useAuth();
  const [notification, setNotification] = React.useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentUser={currentUser} />
      
      <main className="flex flex-1 overflow-hidden">
        <Sidebar currentUserRole={currentUser?.role} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            {/* Si alguien entra a la raíz o a login, lo mandamos al Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<DashboardPage userToken={userToken} />} />
            
            {/* Todas tus rutas de catálogos quedan abiertas ahora */}
            <Route path="/catalogos/telas" element={<TelasCatalogPage userToken={userToken} />} />
            <Route path="/catalogos/disenos-modelos" element={<DisenosModelosCatalogPage userToken={userToken} />} />
            
            {/* ... Resto de tus rutas (puedes quitar el <PrivateRoute> o dejarlo, ya no bloqueará) */}
            
            <Route path="*" element={<DashboardPage userToken={userToken} />} />
          </Routes>
        </div>
      </main>

      <IAAdvisorButton />

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
