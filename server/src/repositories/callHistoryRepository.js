import { CallHistory } from "../models/index.js";

const buscarPorId = (id) => CallHistory.findByPk(id);

const crear = (datos) => CallHistory.create(datos);

const actualizarPorId = async (id, campos) => {
  const [filas] = await CallHistory.update(campos, { where: { id } });
  if (filas === 0) return null;
  return buscarPorId(id);
};

export default { buscarPorId, crear, actualizarPorId };
