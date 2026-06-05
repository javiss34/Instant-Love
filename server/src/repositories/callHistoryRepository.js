import { Op } from "sequelize";
import { CallHistory, User, Profile } from "../models/index.js";

const buscarPorId = (id) => {
  return CallHistory.findByPk(id);
};

const buscarConParticipantes = (id) => {
  return CallHistory.findByPk(id, {
    include: [
      {
        model: User,
        as: "Emisor",
        attributes: ["id", "username"],
        include: [{ model: Profile, attributes: ["nombre"] }],
      },
      {
        model: User,
        as: "Receptor",
        attributes: ["id", "username"],
        include: [{ model: Profile, attributes: ["nombre"] }],
      },
    ],
  });
};

const estadisticasPorUsuario = async (userId) => {
  const llamadas = await CallHistory.findAll({
    where: {
      [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      estado: "COMPLETADA",
      duracion: { [Op.gt]: 0 }, //Solo contamos llamadas que tuvieron duración real, no intentos fallidos
    },
    attributes: ["duracion", "user1Id", "user2Id"],
  });
  const citas = llamadas.length;
  //Sumamos todos los segundos y los convertimos a minutos redondeando hacia abajo
  const minutos = Math.floor(
    llamadas.reduce((suma, l) => suma + (l.duracion || 0), 0) / 60,
  );
  return { citas, minutos };
};
const crear = (datos) => {
  return CallHistory.create(datos);
};

const actualizarPorId = async (id, campos) => {
  const [filas] = await CallHistory.update(campos, { where: { id } });
  if (filas === 0) return null;
  return buscarPorId(id);
};

export default { buscarPorId, buscarConParticipantes, crear, actualizarPorId, estadisticasPorUsuario };
