// Autor: Ing. Miguel Mota
// Fecha de Creación: 2025-08-20 22:40
// Nombre del Archivo: index.js (Control de cambio y secuencia N° 001: Implementación de React 18 createRoot)

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './AuthContext';

// Obtén el elemento raíz del DOM
const container = document.getElementById('root');
const root = createRoot(container);

// Renderiza la aplicación
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
