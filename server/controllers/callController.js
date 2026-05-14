import { CallHistory, Outcome, Profile } from "../models/index.js";
import {
  buscarPareja,
  unirseACola,
  sacarDeCola,
  guardarResultado,
  obtenerResultado,
  eliminarResultado,
} from "../utils/colaEspera.js";

const iniciarLlamada = async (req, res) => {
  try {
    const user1Id = req.usuario.id;
    const { user2Id } = req.body;

    if (!user2Id) {
      return res
        .status(400)
        .json({ mensaje: "Faltan datos de usuario a llamar" });
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

    const miId = req.usuario.id;

    const llamada = await CallHistory.findByPk(id);

    if (!llamada) {
      return res.status(404).json({ mensaje: "Llamada no encontrada" });
    }

    if (llamada.user1Id !== miId && llamada.user2Id !== miId) {
      return res.status(403).json({
        mensaje:
          "¡Hackeo bloqueado! No puedes finalizar una llamada que no es tuya.",
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
    res
      .status(500)
      .json({ mensaje: "Error al finalizar la llamada", error: error.message });
  }
};

const unirseAColaBusqueda = async (req, res) => {
  try {
    const userId = req.usuario.id;

    // Si ya tiene un resultado esperando de un match anterior, devolvérselo
    const llamadaIdPendiente = obtenerResultado(userId);
    if (llamadaIdPendiente) {
      eliminarResultado(userId);
      return res.status(200).json({ status: "match_encontrado", llamadaId: llamadaIdPendiente });
    }

    const perfil = await Profile.findByPk(userId);
    if (!perfil) {
      return res.status(404).json({ mensaje: "Perfil no encontrado." });
    }

    const usuarioEnCola = {
      userId,
      genero: perfil.genero,
      preferencia_genero: perfil.preferencia_genero,
    };

    unirseACola(usuarioEnCola);

    const pareja = buscarPareja(usuarioEnCola);

    if (pareja) {
      // Sacar a ambos de la cola antes de crear la llamada
      sacarDeCola(userId);
      sacarDeCola(pareja.userId);

      const nuevaLlamada = await CallHistory.create({
        user1Id: userId,
        user2Id: pareja.userId,
      });
      await Outcome.create({ callId: nuevaLlamada.id });

      // Guardar el resultado para la pareja (lo recogerá con comprobarEstadoCola)
      guardarResultado(pareja.userId, nuevaLlamada.id);

      return res.status(200).json({ status: "match_encontrado", llamadaId: nuevaLlamada.id });
    }

    return res.status(200).json({ status: "buscando" });
  } catch (error) {
    console.error("Error al unirse a la cola:", error);
    return res.status(500).json({ mensaje: "Error al unirse a la cola.", error: error.message });
  }
};

const comprobarEstadoCola = (req, res) => {
  try {
    const userId = req.usuario.id;
    const llamadaId = obtenerResultado(userId);

    if (llamadaId) {
      eliminarResultado(userId);
      return res.status(200).json({ status: "match_encontrado", llamadaId });
    }

    return res.status(200).json({ status: "buscando" });
  } catch (error) {
    console.error("Error al comprobar la cola:", error);
    return res.status(500).json({ mensaje: "Error al comprobar la cola.", error: error.message });
  }
};

export { iniciarLlamada, finalizarLlamada, unirseAColaBusqueda, comprobarEstadoCola };
