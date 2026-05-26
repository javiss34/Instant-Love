import { User } from "../models/index.js";

const buscarPorEmail = (email) => {return User.findOne({ where: { email } })};

const buscarPorUsername = (username) =>{

  return User.findOne({ where: { username } });
}

const buscarPorId = (id) => {
  return User.findByPk(id)
};

const crear = (datos, transaccion) =>{
  return User.create(datos, { transaction: transaccion });

}

const eliminarPorId = (id) =>{
  return User.destroy({ where: { id }, force: true });

}

export default {
  buscarPorEmail,
  buscarPorUsername,
  buscarPorId,
  crear,
  eliminarPorId,
};
