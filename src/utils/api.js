import axios from 'axios';

// Define la URL base de tu backend.
const API_BASE_URL = 'http://localhost:3001/api'; // Asegúrate de que este puerto coincida con el puerto de tu backend

// Instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autorización automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Asume que guardas el token en localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Funciones CRUD Genéricas para Entidades ---
// Estas funciones pueden ser usadas para cualquier endpoint de CRUD simple
export const getEntities = async (endpoint, filters = {}) => {
  try {
    const response = await api.get(`/${endpoint}`, { params: filters });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener entidades de ${endpoint}:`, error);
    throw error;
  }
};

export const getEntityById = async (endpoint, id) => {
  try {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener entidad ${id} de ${endpoint}:`, error);
    throw error;
  }
};

export const createEntity = async (endpoint, data) => {
  try {
    const response = await api.post(`/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al crear entidad en ${endpoint}:`, error);
    throw error;
  }
};

export const updateEntity = async (endpoint, id, data) => {
  try {
    const response = await api.put(`/${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar entidad ${id} en ${endpoint}:`, error);
    throw error;
  }
};

export const deleteEntity = async (endpoint, id) => {
  try {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar entidad ${id} de ${endpoint}:`, error);
    throw error;
  }
};


// --- Funciones Específicas (si se necesitan rutas o lógicas particulares) ---

// Presupuestos (mantener específicas si tienen lógica compleja o rutas únicas)
export const getPresupuestos = (filters) => getEntities('presupuestos', filters);
export const getPresupuestoById = (id) => getEntityById('presupuestos', id);
export const createPresupuesto = (data) => createEntity('presupuestos', data);
export const updatePresupuesto = (id, data) => updateEntity('presupuestos', id, data);
export const deletePresupuesto = (id) => deleteEntity('presupuestos', id);

// Clientes
export const getClientes = (filters) => getEntities('clientes', filters);
export const createCliente = (data) => createEntity('clientes', data);
export const updateCliente = (id, data) => updateEntity('clientes', id, data);
export const deleteCliente = (id) => deleteEntity('clientes', id);


// Catálogos (usando las funciones genéricas con sus endpoints específicos)
export const getTelas = () => getEntities('catalogos/telas');
export const createTela = (data) => createEntity('catalogos/telas', data);
export const updateTela = (id, data) => updateEntity('catalogos/telas', id, data);
export const deleteTela = (id) => deleteEntity('catalogos/telas', id);

export const getDisenosModelos = () => getEntities('catalogos/disenosmodelos');
export const createDisenoModelo = (data) => createEntity('catalogos/disenosmodelos', data);
export const updateDisenoModelo = (id, data) => updateEntity('catalogos/disenosmodelos', id, data);
export const deleteDisenoModelo = (id) => deleteEntity('catalogos/disenosmodelos', id);

export const getTiposCorte = () => getEntities('catalogos/tiposcorte');
export const createTipoCorte = (data) => createEntity('catalogos/tiposcorte', data);
export const updateTipoCorte = (id, data) => updateEntity('catalogos/tiposcorte', id, data);
export const deleteTipoCorte = (id) => deleteEntity('catalogos/tiposcorte', id);

export const getPersonalizaciones = () => getEntities('catalogos/personalizaciones');
export const createPersonalizacion = (data) => createEntity('catalogos/personalizaciones', data);
export const updatePersonalizacion = (id, data) => updateEntity('catalogos/personalizaciones', id, data);
export const deletePersonalizacion = (id) => deleteEntity('catalogos/personalizaciones', id);

export const getAcabadosEspeciales = () => getEntities('catalogos/acabadosespeciales');
export const createAcabadoEspecial = (data) => createEntity('catalogos/acabadosespeciales', data);
export const updateAcabadoEspecial = (id, data) => updateEntity('catalogos/acabadosespeciales', id, data);
export const deleteAcabadoEspecial = (id) => deleteEntity('catalogos/acabadosespeciales', id);


// Usuarios (si tienes un CRUD de usuarios para administradores)
export const getUsers = (filters) => getEntities('users', filters);
export const getUserById = (id) => getEntityById('users', id);
export const createUser = (data) => createEntity('users', data);
export const updateUser = (id, data) => updateEntity('users', id, data);
export const deleteUser = (id) => deleteEntity('users', id);

// Configuración Global (generalmente es un solo documento)
export const getConfigGlobal = () => getEntities('config'); // Asumiendo que /api/config devuelve el único documento
export const updateConfigGlobal = (id, data) => updateEntity('config', id, data); // Asumiendo que tiene un ID para actualizar


// Autenticación (mantener específicas)
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

export default api;
