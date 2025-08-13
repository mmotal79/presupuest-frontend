// Autor: Ing. Miguel Mota
// Fecha de Creación: 31/07/2025 08:30
// Nombre del Archivo: index.js (Control de cambio y secuencia N° 001: Inclusión de BrowserRouter)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import './index.css'; // Asegúrate de que tu CSS global esté importado
import App from './App';
import reportWebVitals from './reportWebVitals'; // Si lo tienes, si no, puedes omitirlo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve tu App con BrowserRouter aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Si quieres medir el rendimiento de tu app (puedes eliminar esta sección si no la usas)
reportWebVitals();
