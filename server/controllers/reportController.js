import { Report, User, CallHistory } from "../models/index.js";

const crearReporte = async (req, res) => {
  try {
    const reporteroId = req.usuario.id; 

    const { acusadoId, callId, motivo } = req.body;

    if (reporteroId === acusadoId) {
      return res.status(400).json({ mensaje: "No tiene sentido reportarte a ti mismo." });
    }

    if (callId) {
      const llamada = await CallHistory.findByPk(callId);
      if (!llamada || (llamada.user1Id !== reporteroId && llamada.user2Id !== reporteroId)) {
        return res.status(403).json({ 
          mensaje: "No puedes reportar un incidente de una llamada en la que no participaste." 
        });
      }
    }

    const nuevoReporte = await Report.create({
      reporteroId: reporteroId,
      acusadoId: acusadoId,
      callId: callId,
      motivo: motivo,
      estado: "PENDIENTE" 
    });

    res.status(201).json({
      mensaje: "Reporte enviado correctamente. Nuestro equipo lo revisará pronto.",
      reporte: nuevoReporte
    });

  } catch (error) {
    console.error("Error al crear el reporte:", error);
    res.status(500).json({ mensaje: "Hubo un error al procesar tu reporte.", error: error.message });
  }
};

const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Report.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(reportes);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los reportes", error: error.message });
  }
};

export { crearReporte, obtenerReportes };
