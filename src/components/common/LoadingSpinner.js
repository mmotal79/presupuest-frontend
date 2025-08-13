 import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-lg text-gray-700">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;
