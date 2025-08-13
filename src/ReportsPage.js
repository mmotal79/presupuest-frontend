import React from 'react';
import SpendingChart from './SpendingChart'; // Asegúrate de que la ruta sea correcta

/**
 * Componente de la página de Reportes.
 *
 * Esta página mostrará varios gráficos y resúmenes de datos financieros.
 *
 * @returns {JSX.Element} El elemento JSX de la página de reportes.
 */
const ReportsPage = () => {
  // Datos de ejemplo para el gráfico de gastos.
  // En una aplicación real, estos datos vendrían de una base de datos (Firestore).
  const dummyTransactions = [
    { id: '1', description: 'Compra de supermercado', amount: 75.50, type: 'expense', date: '2024-07-25', category: 'Alimentos' },
    { id: '2', description: 'Salario mensual', amount: 2500.00, type: 'income', date: '2024-07-20', category: 'Trabajo' },
    { id: '3', description: 'Cena con amigos', amount: 45.00, type: 'expense', date: '2024-07-24', category: 'Entretenimiento' },
    { id: '4', description: 'Venta de artículo usado', amount: 120.00, type: 'income', date: '2024-07-22', category: 'Ventas' },
    { id: '5', description: 'Factura de electricidad', amount: 88.75, type: 'expense', date: '2024-07-18', category: 'Hogar' },
    { id: '6', description: 'Transporte público', amount: 15.00, type: 'expense', date: '2024-07-23', category: 'Transporte' },
    { id: '7', description: 'Suscripción a streaming', amount: 12.99, type: 'expense', date: '2024-07-10', category: 'Entretenimiento' },
    { id: '8', description: 'Regalo de cumpleaños', amount: 50.00, type: 'expense', date: '2024-07-15', category: 'Regalos' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpendingChart transactions={dummyTransactions} />
        {/* Aquí podríamos añadir otros gráficos o resúmenes en el futuro */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos Reportes</h2>
          <p className="text-gray-600">Aquí se mostrarán más gráficos y análisis financieros.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
