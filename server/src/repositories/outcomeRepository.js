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

export default { buscarPorCallIdConLlamada, crearParaLlamada, guardar };
