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
  return outcomes.map((outcome) => {
    const llamada = outcome.CallHistory;
    return llamada.user1Id === userId ? llamada.user2Id : llamada.user1Id;
  });
};

export default { buscarPorCallIdConLlamada, crearParaLlamada, guardar, listarMatchesPorUsuario };
