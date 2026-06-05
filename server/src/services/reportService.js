import ApiError from "../utils/ApiError.js";
import reportRepository from "../repositories/reportRepository.js";
import callHistoryRepository from "../repositories/callHistoryRepository.js";
import userRepository from "../repositories/userRepository.js";

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

const listarTodos = () => reportRepository.listarTodos();

const actualizarEstado = async (id, estado, nota_revision) => {
  const ESTADOS = ["PENDIENTE", "REVISADO", "SANCIONADO"];
  if (!ESTADOS.includes(estado)) {
    throw new ApiError(400, "Estado no válido.");
  }

  if (estado === "REVISADO" && !nota_revision?.trim()) {
    throw new ApiError(400, "Debes añadir una nota explicando la revisión.");
  }

  const reporte = await reportRepository.actualizarEstado(id, estado, nota_revision?.trim());
  if (!reporte) throw new ApiError(404, "Reporte no encontrado.");

  if (estado === "SANCIONADO") {
    const usuario = await userRepository.buscarPorId(reporte.acusadoId);
    if (usuario && usuario.activo) {
      await usuario.update({ activo: false });
    }
  }

  return reporte;
};

export default { crear, listar, listarTodos, actualizarEstado };
