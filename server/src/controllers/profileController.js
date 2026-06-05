import profileService from "../services/profileService.js";

//Devuelve el perfil completo del usuario que está logueado
const obtenerPerfil = async (req, res) => {
  const perfil = await profileService.obtenerPropio(req.usuario.id);
  res.status(200).json({ perfil });
};

//Para ver el perfil público de otro usuario, por ejemplo desde el detalle del match
const verPerfilPublico = async (req, res) => {
  const perfil = await profileService.obtenerPublico(req.params.id);
  res.status(200).json({ perfil });
};

//El servicio filtra los campos del body para que solo se puedan cambiar los permitidos
const actualizarPerfil = async (req, res) => {
  const perfil = await profileService.actualizarPropio(req.usuario.id, req.body);
  res.status(200).json({
    mensaje: "Perfil actualizado correctamente",
    perfil,
  });
};

//Elimina la cuenta usando el id del token, no del body, para que no se pueda borrar la de otro
const eliminarPerfil = async (req, res) => {
  await profileService.eliminarPropio(req.usuario.id);
  res.status(200).json({ mensaje: "Cuenta eliminada correctamente." });
};

export { obtenerPerfil, actualizarPerfil, eliminarPerfil, verPerfilPublico };
