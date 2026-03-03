import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Para leer el archivo .env
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  },
);

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente");
  } catch (error) {
    console.error("No se puede conectar a la base de datos:", error);
  }
};

export { sequelize, conectarDB };
