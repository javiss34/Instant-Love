import callHistoryRepository from "../repositories/callHistoryRepository.js";
import outcomeRepository from "../repositories/outcomeRepository.js";
import profileRepository from "../repositories/profileRepository.js";
import reportRepository from "../repositories/reportRepository.js";

const obtenerEstadisticas = async (userId, rol) => {
  const [{ citas, minutos, conexiones }, otrosIds] = await Promise.all([
    callHistoryRepository.estadisticasPorUsuario(userId),
    outcomeRepository.listarMatchesPorUsuario(userId),
  ]);

  const perfiles = await Promise.all(
    otrosIds.map((id) => profileRepository.buscarPorId(id)),
  );

  const matches = perfiles.map((p) => ({
    nombre: p?.nombre ?? null,
    foto: p?.foto ?? null,
    red_social_tipo: p?.red_social_tipo ?? null,
    red_social_usuario: p?.red_social_usuario ?? null,
  }));

  const resultado = { citas, minutos, conexiones, matches };

  if (rol === "ADMIN") {
    resultado.reportes = await reportRepository.listarRecientes(10);
  }

  return resultado;
};

export default { obtenerEstadisticas };
