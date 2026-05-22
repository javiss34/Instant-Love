import { Subscription } from "../models/index.js";

const crearParaUsuario = (userId, transaccion) =>
  Subscription.create({ userId }, { transaction: transaccion });

export default { crearParaUsuario };
