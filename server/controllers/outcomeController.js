import { Outcome, CallHistory, Profile } from "../models/index.js";

const registrarVoto = async (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, voto } = req.body;

    const outcome = await Outcome.findOne({
      where: { callId },
      include: { model: CallHistory },
    });

    if (!outcome) {
      return res
        .status(404)
        .json({ mensaje: "Registro de llamada no encontrado" });
    }

    const llamada = outcome.CallHistory;
    let otroUsuarioId = null;

    if (llamada.user1Id === userId) {
      outcome.voto_usuario1 = voto;
      otroUsuarioId = llamada.user2Id;
    } else if (llamada.user2Id === userId) {
      outcome.voto_usuario2 = voto;
      otroUsuarioId = llamada.user1Id;
    } else {
      return res
        .status(403)
        .json({ mensaje: "No has participado en esta llamada" });
    }

    await outcome.save();

    if (outcome.es_match) {
      const perfilOtro = await Profile.findByPk(otroUsuarioId, {
        attributes: ["nombre", "red_social_tipo", "red_social_usuario", "foto"],
      });

      return res.status(200).json({
        mensaje: "¡¡¡HAY INSTANT LOVE!!!",
        match: true,
        contacto: perfilOtro,
      });
    }

    return res.status(200).json({
      mensaje: "Voto registrado correctamente",
      match: false,
    });
  } catch (error) {
    console.error("Error al registrar el voto:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al registrar el voto", error: error.message });
  }
};

export { registrarVoto };
