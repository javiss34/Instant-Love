import api from "../biblioteca/api.js";

const enviarVoto = async (llamadaId, voto) => {
  const respuesta = await api.put(`/voto/${llamadaId}`, { voto });
  return respuesta.data;
};

export { enviarVoto };
