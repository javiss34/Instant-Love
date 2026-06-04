import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/userRepository.js";
import reportRepository from "../repositories/reportRepository.js";

const listarUsuarios = () => userRepository.listarTodos();

const cambiarRol = async (adminId, userId, nuevoRol) => {
  if (adminId === userId) throw new ApiError(400, "No puedes cambiar tu propio rol");
  if (!["USER", "ADMIN"].includes(nuevoRol)) throw new ApiError(400, "Rol no válido");
  const usuario = await userRepository.buscarPorId(userId);
  if (!usuario) throw new ApiError(404, "Usuario no encontrado");
  await usuario.update({ rol: nuevoRol });
  return { id: usuario.id, username: usuario.username, email: usuario.email, rol: nuevoRol };
};

const cambiarActivo = async (adminId, userId) => {
  if (adminId === userId) throw new ApiError(400, "No puedes desactivar tu propia cuenta");
  const usuario = await userRepository.buscarPorId(userId);
  if (!usuario) throw new ApiError(404, "Usuario no encontrado");
  await usuario.update({ activo: !usuario.activo });
  return { id: usuario.id, activo: usuario.activo };
};

const obtenerDetalle = async (userId) => {
  const usuario = await userRepository.buscarPorIdConPerfil(userId);
  if (!usuario) throw new ApiError(404, "Usuario no encontrado");
  const reportes = await reportRepository.listarPorAcusado(userId);
  return {
    id: usuario.id,
    username: usuario.username,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo,
    createdAt: usuario.createdAt,
    foto: usuario.Profile?.foto ?? null,
    reportes,
  };
};

export default { listarUsuarios, cambiarRol, cambiarActivo, obtenerDetalle };
