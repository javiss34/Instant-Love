import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true, //Añade dos columnas en la tabla para la fecha de creación y la de la última modificación.
    paranoid: true, //Añade otra columna en la tabla para la fecha del delete de un usuario.
    hooks: {
      beforeCreate: async (user) => {
        //10 es el factor de coste que indica a la cpu cuantas rondas de procesamiento debe aplicar(29 caracteres).
        const salt = await bcrypt.genSalt(10);
        //Combina salt con la contraseña propiamente codificada también
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

export { User };
