//import React, { useEffect, useRef } from 'react';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registra los elementos necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente SpendingChart.
 *
 * Muestra un gráfico de dona (doughnut chart) de los gastos por categoría.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {Array<object>} props.transactions - Un array de objetos de transacciones para analizar.
 * @returns {JSX.Element} El elemento JSX del gráfico de gastos.
 */
const SpendingChart = ({ transactions }) => {
  // Filtra solo las transacciones de tipo 'expense' (gasto)
  const expenses = transactions.filter(t => t.type === 'expense');

  // Agrupa los gastos por categoría y suma los montos
  const spendingByCategory = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  // Prepara los datos para Chart.js
  const chartData = {
    labels: Object.keys(spendingByCategory), // Nombres de las categorías
    datasets: [
      {
        data: Object.values(spendingByCategory), // Montos de los gastos por categoría
        backgroundColor: [
          '#FF6384', // Rojo
          '#36A2EB', // Azul
          '#FFCE56', // Amarillo
          '#4BC0C0', // Turquesa
          '#9966FF', // Púrpura
          '#FF9F40', // Naranja
          '#5AD3D1', // Verde azulado
          '#E7E9ED', // Gris claro
          '#7B68EE', // Azul pizarra
          '#DAA520', // Dorado
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#5AD3D1',
          '#E7E9ED',
          '#7B68EE',
          '#DAA520',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico no mantenga su aspecto original
    plugins: {
      legend: {
        position: 'right', // Coloca la leyenda a la derecha
        labels: {
          font: {
            size: 14, // Tamaño de la fuente de la leyenda
          },
          color: '#333', // Color de la fuente de la leyenda
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `$${context.parsed.toFixed(2)}`;
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gastos por Categoría</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-600">No hay gastos para mostrar en el gráfico.</p>
      ) : (
        <div className="relative w-full" style={{ height: '300px' }}> {/* Contenedor con altura fija para el gráfico */}
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default SpendingChart;
