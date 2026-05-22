import { Report } from "../models/index.js";

const crear = (datos) => Report.create(datos);

const listar = () => Report.findAll({ order: [["createdAt", "DESC"]] });

export default { crear, listar };
