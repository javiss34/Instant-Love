import adminService from "../services/adminService.js";

//Devuelve todos los usuarios para el panel de administración
const listarUsuarios = async (req, res) => {
  const usuarios = await adminService.listarUsuarios();
  res.status(200).json(usuarios);
};

//Pasamos el id del admin para que el servicio pueda impedir que se cambie el rol a sí mismo
const cambiarRol = async (req, res) => {
  const usuario = await adminService.cambiarRol(req.usuario.id, req.params.id, req.body.rol);
  res.status(200).json(usuario);
};

//Alterna entre activo e inactivo; también pasamos el id del admin para la autoprotección
const cambiarActivo = async (req, res) => {
  const resultado = await adminService.cambiarActivo(req.usuario.id, req.params.id);
  res.status(200).json(resultado);
};

//Devuelve los datos completos de un usuario concreto para la página de detalle del admin
const obtenerDetalle = async (req, res) => {
  const detalle = await adminService.obtenerDetalle(req.params.id);
  res.status(200).json(detalle);
};

export { listarUsuarios, cambiarRol, cambiarActivo, obtenerDetalle };
