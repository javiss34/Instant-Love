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

const crear = (datos, transaccion) => {
  return User.create(datos, { transaction: transaccion });
};

const eliminarPorId = (id) => {
  return User.destroy({ where: { id }, force: true });
};

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
  crear,
  eliminarPorId,
  listarTodos,
};
