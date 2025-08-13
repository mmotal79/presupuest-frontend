import React, { useState } from 'react';

/**
 * Componente AddTransactionForm.
 *
 * Un formulario para añadir nuevas transacciones (ingresos o gastos).
 *
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onAddTransaction - Función de callback que se ejecuta al añadir una transacción.
 * @returns {JSX.Element} El elemento JSX del formulario.
 */
const AddTransactionForm = ({ onAddTransaction }) => {
  // Estados para los campos del formulario
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // Por defecto: gasto
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  // Lista de categorías comunes (puedes expandirla)
  const categories = [
    'Alimentos', 'Transporte', 'Servicios', 'Entretenimiento',
    'Salud', 'Educación', 'Vivienda', 'Compras', 'Regalos', 'Otros'
  ];

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Validación básica
    if (!description || !amount || !date || !category) {
      alert('Por favor, rellena todos los campos.'); // Usar un modal en producción
      return;
    }

    const newTransaction = {
      id: Date.now().toString(), // ID temporal, se generaría en la base de datos
      description,
      amount: parseFloat(amount), // Convierte el monto a número
      type,
      date,
      category,
    };

    // Llama a la función onAddTransaction pasada por las props
    onAddTransaction(newTransaction);

    // Limpia el formulario
    setDescription('');
    setAmount('');
    setDate('');
    setCategory('');
    setType('expense');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Añadir Nueva Transacción</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            id="description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Café de la mañana"
            required
          />
        </div>

        {/* Campo de Monto */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
          <input
            type="number"
            id="amount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 50.00"
            step="0.01" // Permite valores decimales
            required
          />
        </div>

        {/* Campo de Tipo (Ingreso/Gasto) */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            id="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>

        {/* Campo de Fecha */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Campo de Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Añadir Transacción
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
