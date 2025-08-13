import React, { useState } from 'react';
import TransactionTable from './TransactionTable';
import AddTransactionForm from './AddTransactionForm'; // Importa el nuevo formulario

/**
 * Componente de la página de Transacciones.
 *
 * Esta página mostrará el formulario para añadir transacciones y la tabla de transacciones.
 *
 * @returns {JSX.Element} El elemento JSX de la página de transacciones.
 */
const TransactionsPage = () => {
  // Estado para las transacciones (datos de ejemplo por ahora)
  const [transactions, setTransactions] = useState([
    { id: '1', description: 'Compra de supermercado', amount: 75.50, type: 'expense', date: '2024-07-25', category: 'Alimentos' },
    { id: '2', description: 'Salario mensual', amount: 2500.00, type: 'income', date: '2024-07-20', category: 'Trabajo' },
    { id: '3', description: 'Cena con amigos', amount: 45.00, type: 'expense', date: '2024-07-24', category: 'Entretenimiento' },
    { id: '4', description: 'Venta de artículo usado', amount: 120.00, type: 'income', date: '2024-07-22', category: 'Ventas' },
    { id: '5', description: 'Factura de electricidad', amount: 88.75, type: 'expense', date: '2024-07-18', category: 'Hogar' },
    { id: '6', description: 'Transporte público', amount: 15.00, type: 'expense', date: '2024-07-23', category: 'Transporte' },
    { id: '7', description: 'Suscripción a streaming', amount: 12.99, type: 'expense', date: '2024-07-10', category: 'Entretenimiento' },
    { id: '8', description: 'Regalo de cumpleaños', amount: 50.00, type: 'expense', date: '2024-07-15', category: 'Regalos' },
  ]);

  // Función para añadir una nueva transacción
  const handleAddTransaction = (newTransaction) => {
    console.log('Nueva transacción añadida:', newTransaction);
    // En una aplicación real, aquí se añadiría la transacción a Firestore
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  // Función para eliminar una transacción (placeholder)
  const handleDeleteTransaction = (id) => {
    console.log('Eliminar transacción con ID:', id);
    // En una aplicación real, aquí se eliminaría la transacción de Firestore
    setTransactions((prevTransactions) => prevTransactions.filter(t => t.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transacciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna para el formulario de añadir transacción */}
        <div className="md:col-span-1">
          <AddTransactionForm onAddTransaction={handleAddTransaction} />
        </div>
        {/* Columna para la tabla de transacciones */}
        <div className="md:col-span-2">
          <TransactionTable transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
