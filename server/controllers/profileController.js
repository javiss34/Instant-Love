import { Profile, User } from "../models/index.js";

const obtenerPerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const perfil = await Profile.findByPk(id, {
      include: {
        model: User,
        attributes: ["email", "rol", "activo"],
      },
    });

    if (!perfil) {
      return res.status(404).json({ mensaje: "Perfil no encontrado" });
    }

    res.status(200).json({ perfil });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener el perfil", error: error.message });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      red_social_tipo,
      red_social_usuario,
      foto,
      preferencia_genero,
    } = req.body;

    const perfil = await Profile.findByPk(id);

    if (!perfil) {
      return res.status(404).json({ mensaje: "Perfil no encontrado" });
    }

    //Usamos || por si el usuario deja algún campo sin actualizar que se quede con el valor anterior
    await perfil.update({
      nombre: nombre || perfil.nombre,
      red_social_tipo: red_social_tipo || perfil.red_social_tipo,
      red_social_usuario: red_social_usuario || perfil.red_social_usuario,
      foto: foto || perfil.foto,
      preferencia_genero: preferencia_genero || perfil.preferencia_genero,
    });

    res.status(200).json({
      mensaje: "Perfil actualizado correctamente",
      perfil: perfil,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el perfil", error: error.message });
  }
};

export { obtenerPerfil, actualizarPerfil }