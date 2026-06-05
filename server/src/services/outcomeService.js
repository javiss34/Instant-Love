import ApiError from "../utils/ApiError.js";
import outcomeRepository from "../repositories/outcomeRepository.js";
import profileRepository from "../repositories/profileRepository.js";

//Campos del perfil que se comparten con el otro usuario cuando hay match
const CAMPOS_CONTACTO = [
  "nombre",
  "red_social_tipo",
  "red_social_usuario",
  "foto",
];

//Asigna el voto al campo correcto según si el usuario es user1 o user2
//Devuelve el id del otro participante para buscarlo después si hay match
const aplicarVoto = (outcome, llamada, usuarioId, voto) => {
  if (llamada.user1Id === usuarioId) {
    //Evitamos que alguien vote dos veces en la misma llamada
    if (outcome.voto_usuario1 !== "PENDIENTE") {
      throw new ApiError(409, "Ya has emitido tu voto para esta llamada.");
    }
    outcome.voto_usuario1 = voto;
    return llamada.user2Id;
  }
  if (llamada.user2Id === usuarioId) {
    if (outcome.voto_usuario2 !== "PENDIENTE") {
      throw new ApiError(409, "Ya has emitido tu voto para esta llamada.");
    }
    outcome.voto_usuario2 = voto;
    return llamada.user1Id;
  }
  throw new ApiError(403, "No has participado en esta llamada");
};

//Construye el objeto de contacto que se devuelve al frontend cuando hay match
const construirContacto = (perfil) => {
  if (!perfil) return null;
  return Object.fromEntries(CAMPOS_CONTACTO.map((c) => [c, perfil[c]]));
};

const registrar = async (callId, usuarioId, voto) => {
  const outcome = await outcomeRepository.buscarPorCallIdConLlamada(callId);
  if (!outcome) {
    throw new ApiError(404, "Registro de llamada no encontrado");
  }

  const otroUsuarioId = aplicarVoto(outcome, outcome.CallHistory, usuarioId, voto);
  await outcomeRepository.guardar(outcome);

  //es_match es un campo virtual del modelo: devuelve true si los dos votos son LIKE
  if (!outcome.es_match) {
    return { match: false };
  }

  //Solo buscamos el perfil del otro si hay match, para devolver sus datos de contacto
  const perfilOtro = await profileRepository.buscarPorId(otroUsuarioId);
  return { match: true, contacto: construirContacto(perfilOtro) };
};

export default { registrar };
