import axios from "axios";

const CLAVE_TOKEN = "token";

/* Estas funciones sirven para leer, guardar o borrar el token de localStorage,
lo que hace que la sesión del usuario siga iniciada aunque cierre la página */
const leerToken = () => {
  return localStorage.getItem(CLAVE_TOKEN);
};
const guardarToken = (token) => {
  return localStorage.setItem(CLAVE_TOKEN, token);
};
const borrarToken = () => {
  return localStorage.removeItem(CLAVE_TOKEN);
};

/* Creamos una instancia personalizada de Axios con la URL obtenida en el .env. */
const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* Usamos un interceptor, que es un middleware que se ejecuta antes de que cualquier petición salga hacia el servidor. */
instancia.interceptors.request.use((config) => {
  const token = leerToken();
  //Si el usuario tiene un token guardado, se lo inyectamos automáticamente en el Header usando 'Bearer'.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; //la petición sigue su viaje hacia el backend
});

/* Como axios devuelve mucha información por defecto que no nos interesa, creamos este objeto
que nos devuelve solo el .data, que es lo que nos interesa */
const apiClient = {
  get: async (ruta) => {
    const respuesta = await instancia.get(ruta);
    return respuesta.data;
  },
  post: async (ruta, datos) => {
    const respuesta = await instancia.post(ruta, datos);
    return respuesta.data;
  },
  put: async (ruta, datos) => {
    const respuesta = await instancia.put(ruta, datos);
    return respuesta.data;
  },
  patch: async (ruta, datos) => {
    const respuesta = await instancia.patch(ruta, datos);
    return respuesta.data;
  },
  delete: async (ruta) => {
    const respuesta = await instancia.delete(ruta);
    return respuesta.data;
  },
};

export { apiClient, leerToken, guardarToken, borrarToken };