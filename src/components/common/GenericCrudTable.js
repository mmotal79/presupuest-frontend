import React, { useState, useEffect } from 'react';

/**
 * Componente genérico para mostrar y gestionar operaciones CRUD en una tabla.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.title - Título de la tabla (ej. "Gestión de Telas").
 * @param {Array<object>} props.columns - Array de objetos que definen las columnas de la tabla.
 * Cada objeto debe tener: { key: string, label: string, render?: function }.
 * 'key' es el nombre de la propiedad en los datos. 'label' es el encabezado de la columna.
 * 'render' es una función opcional para renderizar contenido personalizado en la celda.
 * @param {function} props.fetchData - Función asíncrona para obtener los datos.
 * @param {function} props.createItem - Función asíncrona para crear un nuevo ítem.
 * @param {function} props.updateItem - Función asíncrona para actualizar un ítem.
 * @param {function} props.deleteItem - Función asíncrona para eliminar un ítem.
 * @param {object} props.formFields - Objeto que define los campos del formulario para crear/editar.
 * Ej: { name: { label: 'Nombre', type: 'text', required: true } }
 * @returns {JSX.Element} El elemento JSX de la tabla CRUD genérica.
 */
const GenericCrudTable = ({
  title,
  columns,
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  formFields,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null para crear, objeto para editar
  const [formData, setFormData] = useState({});

  // Cargar datos al montar el componente o cuando cambian las dependencias
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error al cargar ${title.toLowerCase()}:`, err);
        setError(`Error al cargar ${title.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchData, title]); // Recargar si fetchData o title cambian

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Abrir modal para crear o editar
  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item ? item : {}); // Precargar datos si se está editando
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
    setError(null); // Limpiar errores al cerrar
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        // Actualizar
        await updateItem(editingItem._id, formData); // Asume que el ID es _id
        // Actualizar el estado local después de la actualización exitosa
        setData(data.map(item => item._id === editingItem._id ? { ...item, ...formData } : item));
      } else {
        // Crear
        const newItem = await createItem(formData);
        setData([...data, newItem]); // Añadir el nuevo ítem al estado local
      }
      closeModal();
    } catch (err) {
      console.error(`Error al guardar ${title.toLowerCase()}:`, err);
      setError(`Error al guardar ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ítem
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${title.toLowerCase().slice(0, -1)}?`)) {
      setLoading(true);
      try {
        await deleteItem(id);
        setData(data.filter((item) => item._id !== id)); // Filtrar el ítem eliminado
        setError(null);
      } catch (err) {
        console.error(`Error al eliminar ${title.toLowerCase().slice(0, -1)}:`, err);
        setError(`Error al eliminar ${title.toLowerCase().slice(0, -1)}.`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !data.length) { // Mostrar cargando solo si no hay datos ya
    return <div className="p-6 text-center text-gray-600">Cargando {title.toLowerCase()}...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Añadir Nuevo
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-600">No hay {title.toLowerCase()} para mostrar.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700 bg-gray-50">
                    {col.label}
                  </th>
                ))}
                <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-700 bg-gray-50">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={`${item._id}-${col.key}`} className="py-2 px-4 border-b text-gray-800">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => openModal(item)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Creación/Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Editar' : 'Añadir Nuevo'} {title.toLowerCase().slice(0, -1)}</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              {Object.keys(formFields).map((key) => (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 text-sm font-bold mb-2">
                    {formFields[key].label}:
                  </label>
                  {formFields[key].type === 'textarea' ? (
                    <textarea
                      id={key}
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      required={formFields[key].required}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  ) : (
                    <input
                      type={formFields[key].type}
                      id={key}
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      required={formFields[key].required}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericCrudTable;
