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
  const reportes = await reportService.listarTodos();
  res.status(200).json(reportes);
};

const actualizarEstadoReporte = async (req, res) => {
  const { estado, nota_revision } = req.body;
  const reporte = await reportService.actualizarEstado(req.params.id, estado, nota_revision);
  res.status(200).json(reporte);
};

export { crearReporte, obtenerReportes, actualizarEstadoReporte };
