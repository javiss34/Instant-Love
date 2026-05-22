import axios from "axios";

const CLAVE_TOKEN = "token";

const leerToken = () => localStorage.getItem(CLAVE_TOKEN);
const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token);
const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN);

const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instancia.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiClient = {
  get:    async (ruta)         => (await instancia.get(ruta)).data,
  post:   async (ruta, datos)  => (await instancia.post(ruta, datos)).data,
  put:    async (ruta, datos)  => (await instancia.put(ruta, datos)).data,
  patch:  async (ruta, datos)  => (await instancia.patch(ruta, datos)).data,
  delete: async (ruta)         => (await instancia.delete(ruta)).data,
};

export { apiClient, leerToken, guardarToken, borrarToken };
