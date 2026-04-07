// Autor: Ing. Miguel Mota
// Fecha de Creación: 31/07/2025 08:30
// Nombre del Archivo: Sidebar.js (Control de cambio y secuencia N° 002: Adición de enlace para Tipos de Corte)

import React from 'react';
import { Link } from 'react-router-dom';
import {
  MdDashboard,
  MdBarChart,
  MdAttachMoney,
  MdReceipt,
  MdSettings,
  MdLogout,
  MdArrowDropDownCircle,
} from 'react-icons/md';

/**
 * Componente Sidebar.
 *
 * Esta barra lateral es un componente de navegación que se muestra en la aplicación.
 * Recibe props para controlar su estado de visibilidad y las funciones de manejo de eventos.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {boolean} props.isSidebarOpen - Estado que indica si la barra lateral está abierta.
 * @param {function} props.onLogout - Función de callback para manejar el cierre de sesión.
 * @returns {JSX.Element} El elemento JSX de la barra lateral.
 */
const Sidebar = ({ isSidebarOpen, onLogout }) => {
  return (
    <aside
      className={`fixed z-30 top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">
          <Link to="/">Presupuesto</Link>
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4 px-2">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            >
              <MdDashboard className="mr-3 text-xl" />
              <span>Dashboard</span>
            </Link>
          </li>
          {/* Transactions */}
          <li>
            <Link
              to="/transactions"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            >
              <MdReceipt className="mr-3 text-xl" />
              <span>Transacciones</span>
            </Link>
          </li>
          {/* Budgets */}
          <li>
            <Link
              to="/budgets"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            >
              <MdAttachMoney className="mr-3 text-xl" />
              <span>Presupuestos</span>
            </Link>
          </li>
          {/* Reports */}
          <li>
            <Link
              to="/reports"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            >
              <MdBarChart className="mr-3 text-xl" />
              <span>Reportes</span>
            </Link>
          </li>
          {/* Catalogs - Dropdown (Placeholder) */}
          <li>
            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3 text-sm font-medium cursor-pointer hover:bg-indigo-600 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <MdArrowDropDownCircle className="mr-3 text-xl" />
                  <span>Catálogos</span>
                </div>
                <span className="transform transition-transform duration-200 group-open:rotate-180">
                  <MdArrowDropDownCircle className="text-xl" />
                </span>
              </summary>
              <ul className="pl-6 pt-2 pb-2">
			    <li>
                  <Link
                    to="/catalogos/acabados-especiales"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Acabados Especiales
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalogos/clientes"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Clientes
                  </Link>
                </li>
				<li>
                  <Link
                    to="/catalogos/config-global"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Configuración Global
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalogos/disenos-modelos"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Diseños y Modelos
                  </Link>
                </li>
				
				<li>
                  <Link
                    to="/catalogos/personalizaciones"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Personalizaciones
                  </Link>
                </li>
				
				<li>
                  <Link
                    to="/catalogos/telas"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Telas
                  </Link>
                </li>
				<li>
                  <Link
                    to="/catalogos/tipos-corte"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Tipos de Corte
                  </Link>
                </li>
				<li>
                  <Link
                    to="/catalogos/usuarios"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                  >
                    Usuarios
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          {/* Settings */}
          <li>
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            >
              <MdSettings className="mr-3 text-xl" />
              <span>Ajustes</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Logout button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-400 bg-gray-700 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
        >
          <MdLogout className="mr-3 text-xl" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
