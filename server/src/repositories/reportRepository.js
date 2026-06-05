import { Op } from "sequelize";
import { Report, User } from "../models/index.js";

const crear = (datos) => {
  return Report.create(datos);
};

const listar = () => {
  return Report.findAll({ order: [["createdAt", "DESC"]] });
};

const listarRecientes = (limite = 10) => {
  return Report.findAll({
    where: {
      [Op.or]: [
        { reporteroId: { [Op.not]: null } },
        { acusadoId: { [Op.not]: null } },
      ],
    },
    order: [["createdAt", "DESC"]],
    limit: limite,
    include: [
      { model: User, as: "Autor", attributes: ["username"] },
      { model: User, as: "Destino", attributes: ["username"] },
    ],
  });
};

const listarPorAcusado = (acusadoId) => {
  return Report.findAll({
    where: { acusadoId },
    order: [["createdAt", "DESC"]],
    include: [{ model: User, as: "Autor", attributes: ["username"] }],
  });
};

//Si los dos usuarios están eliminados el reporte no tiene sentido mostrarlos
//Lo ocultamos cuando los dos ids son null a la vez
const listarTodos = () => {
  return Report.findAll({
    where: {
      [Op.or]: [
        { reporteroId: { [Op.not]: null } },
        { acusadoId: { [Op.not]: null } },
      ],
    },
    order: [["createdAt", "DESC"]],
    include: [
      { model: User, as: "Autor", attributes: ["username"] },
      { model: User, as: "Destino", attributes: ["username"] },
    ],
  });
};

const actualizarEstado = async (id, estado, nota_revision) => {
  const campos = { estado };
  if (nota_revision !== undefined) campos.nota_revision = nota_revision;
  const [filas] = await Report.update(campos, { where: { id } });
  if (filas === 0) return null;
  return Report.findByPk(id, {
    include: [
      { model: User, as: "Autor", attributes: ["username"] },
      { model: User, as: "Destino", attributes: ["username"] },
    ],
  });
};

export default { crear, listar, listarRecientes, listarPorAcusado, listarTodos, actualizarEstado };
