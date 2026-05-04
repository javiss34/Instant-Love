import api from "../biblioteca/api.js";

const unirseColaBusqueda = async () => {
  const respuesta = await api.post("/llamadas/cola");
  return respuesta.data;
};

const comprobarColaBusqueda = async () => {
  const respuesta = await api.get("/llamadas/cola");
  return respuesta.data;
};

const iniciarLlamada = async (user2Id) => {
  const respuesta = await api.post("/llamadas/", { user2Id });
  return respuesta.data;
};

const finalizarLlamada = async (id, duracion, estado) => {
  const respuesta = await api.put(`/llamadas/finalizar/${id}`, { duracion, estado });
  return respuesta.data;
};

export { unirseColaBusqueda, comprobarColaBusqueda, iniciarLlamada, finalizarLlamada };
