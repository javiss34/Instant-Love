import adminService from "../services/adminService.js";

const listarUsuarios = async (req, res) => {
  const usuarios = await adminService.listarUsuarios();
  res.status(200).json(usuarios);
};

const cambiarRol = async (req, res) => {
  const usuario = await adminService.cambiarRol(req.usuario.id, req.params.id, req.body.rol);
  res.status(200).json(usuario);
};

const cambiarActivo = async (req, res) => {
  const resultado = await adminService.cambiarActivo(req.usuario.id, req.params.id);
  res.status(200).json(resultado);
};

const obtenerDetalle = async (req, res) => {
  const detalle = await adminService.obtenerDetalle(req.params.id);
  res.status(200).json(detalle);
};

export { listarUsuarios, cambiarRol, cambiarActivo, obtenerDetalle };
