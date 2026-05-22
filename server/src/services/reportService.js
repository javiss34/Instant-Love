import ApiError from "../utils/ApiError.js";
import reportRepository from "../repositories/reportRepository.js";
import callHistoryRepository from "../repositories/callHistoryRepository.js";

const crear = async (reporteroId, datos) => {
  const { acusadoId, callId, motivo } = datos;

  if (reporteroId === acusadoId) {
    throw new ApiError(400, "No tiene sentido reportarte a ti mismo.");
  }

  if (callId) {
    const llamada = await callHistoryRepository.buscarPorId(callId);
    const participante =
      llamada &&
      (llamada.user1Id === reporteroId || llamada.user2Id === reporteroId);
    if (!participante) {
      throw new ApiError(
        403,
        "No puedes reportar un incidente de una llamada en la que no participaste.",
      );
    }
  }

  return reportRepository.crear({
    reporteroId,
    acusadoId,
    callId,
    motivo,
    estado: "PENDIENTE",
  });
};

const listar = () => reportRepository.listar();

export default { crear, listar };
