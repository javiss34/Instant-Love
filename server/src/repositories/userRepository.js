import { User } from "../models/index.js";

const buscarPorEmail = (email) => User.findOne({ where: { email } });

const buscarPorUsername = (username) =>
  User.findOne({ where: { username } });

const buscarPorId = (id) => User.findByPk(id);

const crear = (datos, transaccion) =>
  User.create(datos, { transaction: transaccion });

const eliminarPorId = (id) =>
  User.destroy({ where: { id }, force: true });

export default {
  buscarPorEmail,
  buscarPorUsername,
  buscarPorId,
  crear,
  eliminarPorId,
};
