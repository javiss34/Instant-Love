import { User, Profile } from "../models/index.js";

const buscarPorEmail = (email) => {
  return User.findOne({ where: { email } });
};

const buscarPorUsername = (username) => {
  return User.findOne({ where: { username } });
};

const buscarPorId = (id) => {
  return User.findByPk(id);
};

//Versión con el perfil incluido, para cuando necesitamos la foto además de los datos del usuario
const buscarPorIdConPerfil = (id) => {
  return User.findByPk(id, {
    include: [{ model: Profile, attributes: ["foto"] }],
  });
};

const crear = (datos, transaccion) => {
  return User.create(datos, { transaction: transaccion });
};

//force: true hace un borrado físico real, no solo marcar como eliminado (no usamos paranoid)
const eliminarPorId = (id) => {
  return User.destroy({ where: { id }, force: true });
};

//Devuelve solo los campos necesarios para el panel de admin, sin exponer la contraseña
const listarTodos = () => {
  return User.findAll({
    attributes: ["id", "username", "email", "rol", "activo", "createdAt"],
    include: [{ model: Profile, attributes: ["nombre", "foto"] }],
    order: [["createdAt", "DESC"]],
  });
};

export default {
  buscarPorEmail,
  buscarPorUsername,
  buscarPorId,
  buscarPorIdConPerfil,
  crear,
  eliminarPorId,
  listarTodos,
};
