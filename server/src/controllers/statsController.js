import statsService from "../services/statsService.js";

const obtenerEstadisticas = async (req, res) => {
  const estadisticas = await statsService.obtenerEstadisticas(req.usuario.id);
  res.status(200).json(estadisticas);
};

export { obtenerEstadisticas };
