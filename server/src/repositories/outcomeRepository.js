import { Op } from "sequelize";
import { Outcome, CallHistory } from "../models/index.js";

const buscarPorCallIdConLlamada = (callId) => {
  return Outcome.findOne({ where: { callId }, include: { model: CallHistory } });
};

const crearParaLlamada = (callId) => {
  return Outcome.create({ callId });
};

const guardar = (outcome) => {
  return outcome.save();
};

//Busca todas las llamadas donde los dos votaron LIKE y el usuario participó
//Devuelve un array con los ids de los otros usuarios (pueden repetirse si han hecho match varias veces)
const listarMatchesPorUsuario = async (userId) => {
  const outcomes = await Outcome.findAll({
    where: { voto_usuario1: "LIKE", voto_usuario2: "LIKE" },
    include: {
      model: CallHistory,
      required: true,
      where: { [Op.or]: [{ user1Id: userId }, { user2Id: userId }] },
      attributes: ["user1Id", "user2Id"],
    },
    attributes: ["id"],
  });
  //Dependiendo de si fuiste user1 o user2, el otro es el otro campo
  return outcomes.map((outcome) => {
    const llamada = outcome.CallHistory;
    return llamada.user1Id === userId ? llamada.user2Id : llamada.user1Id;
  });
};

export default { buscarPorCallIdConLlamada, crearParaLlamada, guardar, listarMatchesPorUsuario };
