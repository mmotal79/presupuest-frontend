import React from 'react';

/**
 * Componente BudgetList.
 *
 * Muestra una lista de presupuestos. Cada presupuesto incluye una categoría,
 * un monto límite y el monto gastado hasta el momento.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {Array<object>} props.budgets - Un array de objetos de presupuesto.
 * Cada objeto debe tener: _id (importante para MongoDB), category, limit, spent.
 * @param {function} props.onDeleteBudget - Función de callback para eliminar un presupuesto.
 * @returns {JSX.Element} El elemento JSX de la lista de presupuestos.
 */
const BudgetList = ({ budgets, onDeleteBudget }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mis Presupuestos</h2>
      {budgets.length === 0 ? (
        <p className="text-gray-600">No hay presupuestos definidos. ¡Crea uno para empezar a controlar tus gastos!</p>
      ) : (
        <ul className="space-y-4">
          {budgets.map((budget) => {
            // Calcula el porcentaje gastado
            const percentageSpent = (budget.spent / budget.limit) * 100;
            // Determina el color de la barra de progreso
            let progressBarColor = 'bg-green-500';
            if (percentageSpent >= 75) {
              progressBarColor = 'bg-red-500'; // Rojo si se ha gastado el 75% o más
            } else if (percentageSpent >= 50) {
              progressBarColor = 'bg-yellow-500'; // Amarillo si se ha gastado el 50% o más
            }

            return (
              <li key={budget._id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-1 mb-2 sm:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">{budget.category}</h3>
                  <p className="text-gray-600 text-sm">
                    Gastado: <span className="font-semibold text-gray-800">${budget.spent.toFixed(2)}</span> de <span className="font-semibold text-gray-800">${budget.limit.toFixed(2)}</span>
                  </p>
                </div>
                <div className="w-full sm:w-1/3 ml-0 sm:ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${progressBarColor} h-2.5 rounded-full`}
                      style={{ width: `${Math.min(100, percentageSpent)}%` }} // Asegura que no exceda el 100%
                    ></div>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1">{percentageSpent.toFixed(1)}%</p>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => console.log(`Editar presupuesto: ${budget._id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    onClick={() => onDeleteBudget(budget._id)} // Llama a la función de eliminación
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-6 text-center">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 text-lg font-medium">
          Añadir Nuevo Presupuesto
        </button>
      </div>
    </div>
  );
};

export default BudgetList;
