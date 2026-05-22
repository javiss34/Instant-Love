import { Outcome, CallHistory } from "../models/index.js";

const buscarPorCallIdConLlamada = (callId) =>
  Outcome.findOne({ where: { callId }, include: { model: CallHistory } });

const crearParaLlamada = (callId) => Outcome.create({ callId });

const guardar = (outcome) => outcome.save();

export default { buscarPorCallIdConLlamada, crearParaLlamada, guardar };
