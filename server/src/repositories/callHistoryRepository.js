import { Op } from "sequelize";
import { CallHistory } from "../models/index.js";

const buscarPorId = (id) => {
  return CallHistory.findByPk(id);
};

const estadisticasPorUsuario = async (userId) => {
  const llamadas = await CallHistory.findAll({
    where: {
      [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      estado: "COMPLETADA",
    },
    attributes: ["duracion", "user1Id", "user2Id"],
  });
  const citas = llamadas.length;
  const minutos = Math.floor(
    llamadas.reduce((suma, l) => suma + (l.duracion || 0), 0) / 60,
  );
  const conexiones = new Set(
    llamadas.map((l) => (l.user1Id === userId ? l.user2Id : l.user1Id)),
  ).size;
  return { citas, minutos, conexiones };
};
const crear = (datos) => {
  return CallHistory.create(datos);
};

const actualizarPorId = async (id, campos) => {
  const [filas] = await CallHistory.update(campos, { where: { id } });
  if (filas === 0) return null;
  return buscarPorId(id);
};

export default { buscarPorId, crear, actualizarPorId, estadisticasPorUsuario };
