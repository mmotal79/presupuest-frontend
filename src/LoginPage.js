import React, { useState } from 'react';
import { loginWithGoogle } from './firebase'; // Nuestra función de Firebase
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react'; // Iconos para estilo profesional

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      await loginWithGoogle();
      // El AuthContext detectará el cambio y actualizará el estado global
      navigate('/dashboard');
    } catch (err) {
      console.error("Error de login:", err);
      setError("No se pudo iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4 shadow-lg">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">T&G Publieventos</h1>
          <p className="text-gray-500 mt-2 font-medium">Sistema de Gestión de Presupuestos</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isAuthenticating}
          className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 py-3.5 px-4 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 ${
            isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isAuthenticating ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></span>
          ) : (
            <>
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                className="w-6 h-6" 
                alt="Google" 
              />
              {isAuthenticating ? 'Autenticando...' : 'Iniciar con Google'}
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Acceso Institucional Protegido
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;