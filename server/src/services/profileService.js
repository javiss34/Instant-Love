import ApiError from "../utils/ApiError.js";
import profileRepository from "../repositories/profileRepository.js";
import userRepository from "../repositories/userRepository.js";

//Solo dejamos que el usuario pueda modificar estos campos de su perfil
const CAMPOS_EDITABLES = [
  "nombre",
  "red_social_tipo",
  "red_social_usuario",
  "foto",
  "preferencia_genero",
];

const obtenerPropio = async (usuarioId) => {
  const perfil = await profileRepository.buscarPorIdConUsuario(usuarioId);
  if (!perfil) throw new ApiError(404, "Perfil no encontrado");
  return perfil;
};

const obtenerPublico = async (id) => {
  const perfil = await profileRepository.buscarPorIdConActivo(id);
  if (!perfil) throw new ApiError(404, "Este perfil ya no está disponible.");
  return perfil;
};

const actualizarPropio = async (usuarioId, datos) => {
  //Filtramos el body para que solo lleguen al repositorio los campos que se pueden cambiar
  const camposPermitidos = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (datos[campo] !== undefined) {
      camposPermitidos[campo] = datos[campo];
    }
  }

  const actualizado = await profileRepository.actualizarPorId(
    usuarioId,
    camposPermitidos,
  );
  if (!actualizado) throw new ApiError(404, "Perfil no encontrado");
  return actualizado;
};

const eliminarPropio = async (usuarioId) => {
  //Borramos el usuario directamente; el perfil se elimina en cascada por la relación de la BD
  const eliminados = await userRepository.eliminarPorId(usuarioId);
  if (eliminados === 0) throw new ApiError(404, "Usuario no encontrado.");
};

export default {
  obtenerPropio,
  obtenerPublico,
  actualizarPropio,
  eliminarPropio,
};
