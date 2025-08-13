import React from 'react';

/**
 * Componente DashboardPage.
 *
 * Esta página mostrará un resumen general de las finanzas del usuario.
 * Por ahora, es un marcador de posición.
 *
 * @returns {JSX.Element} El elemento JSX de la página del Dashboard.
 */
const DashboardPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <p className="text-gray-700 text-lg">
        ¡Bienvenido a tu Dashboard! Aquí podrás ver un resumen de tus ingresos, gastos y el estado de tus presupuestos.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Resumen de Saldo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Saldo Actual</h2>
          <p className="text-3xl font-bold text-green-600">$2,350.00</p>
          <p className="text-sm text-gray-500 mt-2">Última actualización: Hoy</p>
        </div>

        {/* Tarjeta de Gastos del Mes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Gastos del Mes</h2>
          <p className="text-3xl font-bold text-red-600">$850.00</p>
          <p className="text-sm text-gray-500 mt-2">Hasta la fecha</p>
        </div>

        {/* Tarjeta de Ingresos del Mes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ingresos del Mes</h2>
          <p className="text-3xl font-bold text-blue-600">$3,200.00</p>
          <p className="text-sm text-gray-500 mt-2">Hasta la fecha</p>
        </div>

        {/* Espacio para gráficos o más resúmenes */}
        <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Próximamente: Gráficos y Análisis</h2>
          <p className="text-gray-600">
            Aquí podrás ver visualizaciones de tus tendencias financieras, presupuestos y más.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
