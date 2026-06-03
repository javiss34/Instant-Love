import { Report, User } from "../models/index.js";

const crear = (datos) => {
  return Report.create(datos);
};

const listar = () => {
  return Report.findAll({ order: [["createdAt", "DESC"]] });
};

const listarRecientes = (limite = 10) => {
  return Report.findAll({
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

const listarTodos = () => {
  return Report.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: User, as: "Autor", attributes: ["username"] },
      { model: User, as: "Destino", attributes: ["username"] },
    ],
  });
};

const actualizarEstado = async (id, estado) => {
  const [filas] = await Report.update({ estado }, { where: { id } });
  if (filas === 0) return null;
  return Report.findByPk(id, {
    include: [
      { model: User, as: "Autor", attributes: ["username"] },
      { model: User, as: "Destino", attributes: ["username"] },
    ],
  });
};

export default { crear, listar, listarRecientes, listarPorAcusado, listarTodos, actualizarEstado };
