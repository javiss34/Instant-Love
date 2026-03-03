import express from "express";
import cors from "cors";
import { sequelize, conectarDB } from "./config/db.js";
import "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import outcomeRoutes from "./routes/outcomeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/perfil", profileRoutes);
app.use("/api/llamadas", callRoutes);
app.use("/api/voto", outcomeRoutes);
app.use("/api/reportes", reportRoutes);

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
