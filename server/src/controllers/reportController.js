import reportService from "../services/reportService.js";

//El usuario denuncia a otro; el id del reportero sale del token para que no se pueda falsificar
const crearReporte = async (req, res) => {
  const reporte = await reportService.crear(req.usuario.id, req.body);
  res.status(201).json({
    mensaje:
      "Reporte enviado correctamente. Nuestro equipo lo revisará pronto.",
    reporte,
  });
};

//Solo accesible para admins; devuelve todos los reportes para gestionar desde el panel
const obtenerReportes = async (req, res) => {
  const reportes = await reportService.listarTodos();
  res.status(200).json(reportes);
};

//Si el estado es REVISADO hay que incluir nota; si es SANCIONADO el servicio desactiva la cuenta automáticamente
const actualizarEstadoReporte = async (req, res) => {
  const { estado, nota_revision } = req.body;
  const reporte = await reportService.actualizarEstado(req.params.id, estado, nota_revision);
  res.status(200).json(reporte);
};

export { crearReporte, obtenerReportes, actualizarEstadoReporte };
