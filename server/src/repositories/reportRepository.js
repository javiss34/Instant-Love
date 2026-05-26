import { Report } from "../models/index.js";

const crear = (datos) => {
  return Report.create(datos);
};

const listar = () => {
  return Report.findAll({ order: [["createdAt", "DESC"]] });
};

export default { crear, listar };
