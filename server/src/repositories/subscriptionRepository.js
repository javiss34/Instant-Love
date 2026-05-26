import { Subscription } from "../models/index.js";

const crearParaUsuario = (userId, transaccion) =>{
  return Subscription.create({ userId }, { transaction: transaccion });

}

export default { crearParaUsuario };
