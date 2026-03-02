import { Sequelize } from "sequelize";

const sequelize = new Sequelize("instantlovedb", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3310,
  logging: false,
});

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente");
  } catch (error) {
    console.error("No se puede conectar a la base de datos:", error);
  }
};

export { sequelize, conectarDB };
