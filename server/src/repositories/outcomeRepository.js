import { Outcome, CallHistory } from "../models/index.js";

const buscarPorCallIdConLlamada = (callId) =>
  Outcome.findOne({ where: { callId }, include: { model: CallHistory } });

const crearParaLlamada = (callId) => Outcome.create({ callId });

export default { buscarPorCallIdConLlamada, crearParaLlamada };
