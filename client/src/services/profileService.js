import api from "../biblioteca/api.js";

const obtenerMiPerfil = async () => {
  const respuesta = await api.get("/perfil/");
  return respuesta.data.perfil;
};

const actualizarPerfil = async (datos) => {
  const respuesta = await api.put("/perfil/", datos);
  return respuesta.data.perfil;
};

export { obtenerMiPerfil, actualizarPerfil };
