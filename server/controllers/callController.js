import { CallHistory, Outcome } from "../models/index.js";

const iniciarLlamada = async (req, res) => {
  try {
    const user1Id = req.usuario.id; 
    const { user2Id } = req.body;

    if (!user2Id) {
      return res.status(400).json({ mensaje: "Faltan datos de usuario a llamar" });
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
    res.status(500).json({ mensaje: "Error al iniciar la llamada", error: error.message });
  }
};

const finalizarLlamada = async (req, res) => {
  try {
    const { id } = req.params;
    const { duracion, estado } = req.body;
    
    // ✅ Tienes que saber quién está intentando colgar
    const miId = req.usuario.id; 

    const llamada = await CallHistory.findByPk(id);

    if (!llamada) {
      return res.status(404).json({ mensaje: "Llamada no encontrada" });
    }

    if (llamada.user1Id !== miId && llamada.user2Id !== miId) {
      return res.status(403).json({ 
        mensaje: "¡Hackeo bloqueado! No puedes finalizar una llamada que no es tuya." 
      });
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
    res.status(500).json({ mensaje: "Error al finalizar la llamada", error: error.message });
  }
};

export { iniciarLlamada, finalizarLlamada };
