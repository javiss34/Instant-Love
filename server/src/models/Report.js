import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("PENDIENTE", "REVISADO", "SANCIONADO"),
      defaultValue: "PENDIENTE",
    },
  },
  {
    timestamps: true,
  },
);

export {Report};