import { Profile, User } from "../models/index.js";

const buscarPorIdConUsuario = (id) =>
  Profile.findByPk(id, {
    include: {
      model: User,
      attributes: ["username", "email", "rol", "activo"],
    },
  });

const buscarPorIdConActivo = (id) =>
  Profile.findByPk(id, {
    include: { model: User, attributes: ["activo"] },
  });

const buscarPorId = (id) => {
  return Profile.findByPk(id);
};

const crear = (datos, transaccion) => {
  return Profile.create(datos, { transaction: transaccion });
};

const actualizarPorId = async (id, campos) => {
  const [filas] = await Profile.update(campos, { where: { id } });
  if (filas === 0) return null;
  return buscarPorIdConUsuario(id);
};

export default {
  buscarPorIdConUsuario,
  buscarPorIdConActivo,
  buscarPorId,
  crear,
  actualizarPorId,
};
