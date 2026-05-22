import reportService from "../services/reportService.js";

const crearReporte = async (req, res) => {
  const reporte = await reportService.crear(req.usuario.id, req.body);
  res.status(201).json({
    mensaje:
      "Reporte enviado correctamente. Nuestro equipo lo revisará pronto.",
    reporte,
  });
};

const obtenerReportes = async (req, res) => {
  const reportes = await reportService.listar();
  res.status(200).json(reportes);
};

export { crearReporte, obtenerReportes };
