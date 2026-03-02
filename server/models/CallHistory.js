import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const CallHistory = sequelize.define(
  "CallHistory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        max: 120,
      },
    },
    estado: {
      type: DataTypes.ENUM("COMPLETADA", "INTERRUMPIDA", "ERROR"),
      defaultValue: "COMPLETADA",
      allowNull: false,
    },
  },
  { timestamps: true },
);

export {CallHistory};
