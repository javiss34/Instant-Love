import { CallHistory, Outcome } from "../models/index.js";

const iniciarLlamada = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ mensaje: "Faltan datos de usuario" });
    }

    const nuevaLlamada = await CallHistory.create({
      user1Id,
      user2Id,
    });

    await Outcome.create({
      callId: nuevaLlamada.id,
    });

    res.status(201).json({
      mensaje: "Llamada iniciada correctamente",
      llamadaId: nuevaLlamada.id,
    });
  } catch (error) {
    console.error("Error al iniciar la llamada:", error);
    res
      .status(500)
      .json({ mensaje: "Error al iniciar la llamada", error: error.message });
  }
};

const finalizarLlamada = async (req, res) => {
  try {
    const { id } = req.params;
    const { duracion, estado } = req.body;

    const llamada = await CallHistory.findByPk(id);

    if (!llamada) {
      return res.status(404).json({ mensaje: "Llamada no encontrada" });
    }

    await llamada.update({
      duracion: duracion || llamada.duracion,
      estado: estado || llamada.estado,
    });

    res.status(200).json({
      mensaje: "Llamada finalizada correctamente",
      llamada: llamada,
    });
  } catch (error) {
    console.error("Error al finalizar la llamada:", error);
    res
      .status(500)
      .json({ mensaje: "Error al finalizar la llamada", error: error.message });
  }
};

export { iniciarLlamada, finalizarLlamada };