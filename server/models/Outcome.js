import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Outcome = sequelize.define(
  "Outcome",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    voto_usuario1: {
      type: DataTypes.ENUM("LIKE", "NEXT", "PENDIENTE"),
      defaultValue: "PENDIENTE",
    },
    voto_usuario2: {
      type: DataTypes.ENUM("LIKE", "NEXT", "PENDIENTE"),
      defaultValue: "PENDIENTE",
    },
    es_match: {
      type: DataTypes.VIRTUAL,//No crea la columna en la base de datos.
      //Cada vez que se llama a es_match se ejecuta lo siguiente, que devuelve un boolean.
      get() {
        return this.voto_usuario1 === "LIKE" && this.voto_usuario2 === "LIKE";
      },
    },
  },
  {
    timestamps: true,
  },
);

export {Outcome};