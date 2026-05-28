import ApiError from "../utils/ApiError.js";
import callHistoryRepository from "../repositories/callHistoryRepository.js";
import outcomeRepository from "../repositories/outcomeRepository.js";
import profileRepository from "../repositories/profileRepository.js";
import * as colaEspera from "../utils/colaEspera.js";

const CAMPOS_FINALIZAR = ["duracion", "estado"];

const iniciar = async (user1Id, user2Id) => {
  if (!user2Id) throw new ApiError(400, "Faltan datos de usuario a llamar");
  const llamada = await callHistoryRepository.crear({ user1Id, user2Id });
  await outcomeRepository.crearParaLlamada(llamada.id);
  return llamada;
};

const finalizar = async (id, usuarioId, datos) => {
  const llamada = await callHistoryRepository.buscarPorId(id);
  if (!llamada) throw new ApiError(404, "Llamada no encontrada");

  const esParticipante =
    llamada.user1Id === usuarioId || llamada.user2Id === usuarioId;
  if (!esParticipante) {
    throw new ApiError(
      403,
      "¡Hackeo bloqueado! No puedes finalizar una llamada que no es tuya.",
    );
  }

  const camposPermitidos = {};
  for (const campo of CAMPOS_FINALIZAR) {
    if (datos[campo] !== undefined) camposPermitidos[campo] = datos[campo];
  }
  await llamada.update(camposPermitidos);
  return llamada;
};

const crearMatch = async (userIdA, userIdB) => {
  colaEspera.sacarDeCola(userIdA);
  colaEspera.sacarDeCola(userIdB);

  const llamada = await callHistoryRepository.crear({
    user1Id: userIdA,
    user2Id: userIdB,
  });
  await outcomeRepository.crearParaLlamada(llamada.id);
  colaEspera.guardarResultado(userIdB, llamada.id);

  return llamada;
};

const unirseACola = async (userId) => {
  const llamadaIdPendiente = colaEspera.obtenerResultado(userId);
  if (llamadaIdPendiente) {
    colaEspera.eliminarResultado(userId);
    return { status: "match_encontrado", llamadaId: llamadaIdPendiente };
  }

  const perfil = await profileRepository.buscarPorId(userId);
  if (!perfil) throw new ApiError(404, "Perfil no encontrado.");

  const usuarioEnCola = {
    userId,
    genero: perfil.genero,
    preferencia_genero: perfil.preferencia_genero,
  };

  colaEspera.unirseACola(usuarioEnCola);
  const pareja = colaEspera.buscarPareja(usuarioEnCola);

  if (!pareja) {
    return { status: "buscando" };
  }

  const llamada = await crearMatch(userId, pareja.userId);
  return { status: "match_encontrado", llamadaId: llamada.id };
};

const obtenerParticipante = async (callId, usuarioId) => {
  const llamada = await callHistoryRepository.buscarConParticipantes(callId);
  if (!llamada) throw new ApiError(404, "Llamada no encontrada");

  const esParticipante =
    llamada.user1Id === usuarioId || llamada.user2Id === usuarioId;
  if (!esParticipante) throw new ApiError(403, "No eres participante de esta llamada");

  const otro =
    llamada.user1Id === usuarioId ? llamada.Receptor : llamada.Emisor;

  return {
    id: otro?.id ?? null,
    username: otro?.username ?? null,
    nombre: otro?.Profile?.nombre ?? null,
  };
};

const comprobarEstadoCola = (userId) => {
  const llamadaId = colaEspera.obtenerResultado(userId);
  if (llamadaId) {
    colaEspera.eliminarResultado(userId);
    return { status: "match_encontrado", llamadaId };
  }
  return { status: "buscando" };
};

export default { iniciar, finalizar, obtenerParticipante, unirseACola, comprobarEstadoCola };
