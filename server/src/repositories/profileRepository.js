import { Profile, User } from "../models/index.js";

const buscarPorIdConUsuario = (id) =>
  Profile.findByPk(id, {
    include: { model: User, attributes: ["username", "email", "rol", "activo"] },
  });

const buscarPorIdConActivo = (id) =>
  Profile.findByPk(id, {
    include: { model: User, attributes: ["activo"] },
  });

const buscarPorId = (id) => Profile.findByPk(id);

const crear = (datos, transaccion) =>
  Profile.create(datos, { transaction: transaccion });

export default {
  buscarPorIdConUsuario,
  buscarPorIdConActivo,
  buscarPorId,
  crear,
};
