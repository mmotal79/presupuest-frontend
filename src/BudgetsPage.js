import React, { useState, useEffect } from 'react';
import BudgetList from './BudgetList';
import { getPresupuestos } from './utils/api'; // Importa la función para obtener presupuestos de tu API

/**
 * Componente de la página de Presupuestos.
 *
 * Esta página cargará y mostrará la lista de presupuestos del usuario
 * desde el backend.
 *
 * @returns {JSX.Element} El elemento JSX de la página de presupuestos.
 */
const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const data = await getPresupuestos(); // Llama a tu API para obtener los presupuestos
        setBudgets(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los presupuestos:', err);
        setError('Error al cargar los presupuestos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  // Función placeholder para manejar la eliminación de un presupuesto
  // En una implementación real, esto llamaría a deletePresupuesto de la API
  const handleDeleteBudget = async (id) => {
    console.log(`Intentando eliminar presupuesto con ID: ${id}`);
    // Aquí iría la lógica para llamar a deletePresupuesto(id) de tu API
    // y luego actualizar el estado 'budgets' si la eliminación es exitosa.
    // Ejemplo:
    /*
    try {
      await deletePresupuesto(id);
      setBudgets(budgets.filter(budget => budget._id !== id)); // Asumiendo que tu backend devuelve _id
      // Mostrar notificación de éxito
    } catch (err) {
      console.error('Error al eliminar presupuesto:', err);
      // Mostrar notificación de error
    }
    */
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Cargando presupuestos...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <p>Asegúrate de que tu backend esté corriendo en <span className="font-bold">http://localhost:3001</span>.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Presupuestos</h1>
      <BudgetList budgets={budgets} onDeleteBudget={handleDeleteBudget} />
      {/* Aquí podríamos añadir un botón para añadir nuevo presupuesto que abra un modal */}
    </div>
  );
};

export default BudgetsPage;
