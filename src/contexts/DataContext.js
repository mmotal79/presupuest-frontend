 import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api'; // Importa todas las funciones de tu API
import { useAuth } from './AuthContext'; // Para saber si el usuario está autenticado y tiene permisos

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth(); // Obtén el usuario y el estado de carga de AuthContext
  const [catalogs, setCatalogs] = useState({
    telas: [],
    disenoModelos: [],
    tiposCorte: [],
    personalizaciones: [],
    acabadosEspeciales: [],
    clientes: [],
    users: [], // Usuarios del sistema
    configGlobal: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      if (authLoading || !user) { // Espera a que la autenticación termine y haya un usuario
        setIsLoading(true); // Mantén el estado de carga si la autenticación no ha terminado
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const [
          telas,
          disenoModelos,
          tiposCorte,
          personalizaciones,
          acabadosEspeciales,
          clientes,
          users,
          configGlobal
        ] = await Promise.all([
          api.getTelas(),
          api.getAll('catalogo/disenos-modelos'), // Usar getAll para rutas sin función específica
          api.getAll('catalogo/tipos-corte'),
          api.getAll('catalogo/personalizaciones'),
          api.getAll('catalogo/acabados-especiales'),
          api.getAll('clientes'), // Asumiendo que tienes un endpoint para clientes
          api.getAll('users'), // Asumiendo que tienes un endpoint para usuarios del sistema
          api.getConfigGlobal()
        ]);

        setCatalogs({
          telas,
          disenoModelos,
          tiposCorte,
          personalizaciones,
          acabadosEspeciales,
          clientes,
          users,
          configGlobal
        });
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
        setError("No se pudieron cargar los datos de los catálogos. Por favor, intente de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogs();
  }, [user, authLoading]); // Vuelve a cargar si el usuario o el estado de autenticación cambian

  // Función para recargar un catálogo específico
  const refetchCatalog = async (catalogName) => {
    setError(null);
    try {
      let data;
      switch (catalogName) {
        case 'telas':
          data = await api.getTelas();
          break;
        case 'disenoModelos':
          data = await api.getAll('catalogo/disenos-modelos');
          break;
        case 'tiposCorte':
          data = await api.getAll('catalogo/tipos-corte');
          break;
        case 'personalizaciones':
          data = await api.getAll('catalogo/personalizaciones');
          break;
        case 'acabadosEspeciales':
          data = await api.getAll('catalogo/acabados-especiales');
          break;
        case 'clientes':
          data = await api.getAll('clientes');
          break;
        case 'users':
          data = await api.getAll('users');
          break;
        case 'configGlobal':
          data = await api.getConfigGlobal();
          break;
        default:
          throw new Error(`Catálogo desconocido: ${catalogName}`);
      }
      setCatalogs(prev => ({ ...prev, [catalogName]: data }));
      return data;
    } catch (err) {
      console.error(`Error al recargar ${catalogName}:`, err);
      setError(`No se pudo recargar el catálogo de ${catalogName}.`);
      throw err;
    }
  };


  const value = {
    catalogs,
    isLoading,
    error,
    refetchCatalog
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};
