import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [2, 50] },
  },
  red_social_tipo: {
    type: DataTypes.ENUM("INSTAGRAM", "WHATSAPP", "TIK TOK", "OTRO"),
    allowNull: true,
    defaultValue: "INSTAGRAM",
  },
  red_social_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [2,100]
    }
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: { isDate: true },
  },
  foto: {
    type: DataTypes.STRING,
    defaultValue: "https://cdn-icons-png.freepik.com/512/9218/9218712.png",
  },
  genero: {
    type: DataTypes.ENUM("H", "M", "O"),
    allowNull: false,
  },
  preferencia_genero: {
    type: DataTypes.ENUM("H", "M", "AMBOS"),
    allowNull: false,
  },
},{
  timestamps: true
});

export { Profile };
