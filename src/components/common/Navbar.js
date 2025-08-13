import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/login"} className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
          T&G Presupuestos
        </Link>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Bienvenido, {user.nombre || user.email} ({user.rol})</span>
              {user.rol === 'admin' || user.rol === 'gerente' ? (
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Administración
                </Link>
              ) : null}
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
 