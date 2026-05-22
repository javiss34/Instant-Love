import profileService from "../services/profileService.js";

const obtenerPerfil = async (req, res) => {
  const perfil = await profileService.obtenerPropio(req.usuario.id);
  res.status(200).json({ perfil });
};

const verPerfilPublico = async (req, res) => {
  const perfil = await profileService.obtenerPublico(req.params.id);
  res.status(200).json({ perfil });
};

const actualizarPerfil = async (req, res) => {
  const perfil = await profileService.actualizarPropio(req.usuario.id, req.body);
  res.status(200).json({
    mensaje: "Perfil actualizado correctamente",
    perfil,
  });
};

const eliminarPerfil = async (req, res) => {
  await profileService.eliminarPropio(req.usuario.id);
  res.status(200).json({ mensaje: "Cuenta eliminada correctamente." });
};

export { obtenerPerfil, actualizarPerfil, eliminarPerfil, verPerfilPublico };
