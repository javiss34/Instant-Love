import express from "express";
import cors from "cors";
import { sequelize, conectarDB } from "./config/db.js";
import "./models/index.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/api/saludo", (req, res) => {
  res.json({ mensaje: "Esto es Instant Love!!" });
});

const iniciarServidor = async () => {
  await conectarDB();
  await sequelize.sync({ alter: true });
  console.log("Modelos sincronizados con instantlovedb");
  app.listen(PORT, () => {
    console.log(
      `Servidor HTTP en ejecución en puerto http://localhost:${PORT}.`,
    );
  });
};

iniciarServidor();
