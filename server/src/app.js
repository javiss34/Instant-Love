import express from "express";
import cors from "cors";
import { DataTypes } from "sequelize";
import { sequelize, conectarDB } from "./config/db.js";
import "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import outcomeRoutes from "./routes/outcomeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/perfil", profileRoutes);
app.use("/api/llamadas", callRoutes);
app.use("/api/voto", outcomeRoutes);
app.use("/api/reportes", reportRoutes);
app.use("/api/estadisticas", statsRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const iniciarServidor = async () => {
  await conectarDB();
  //sync() solo crea las tablas si no existen, no toca las que ya están creadas
  await sequelize.sync();
  //Como sync() no añade columnas nuevas a tablas existentes, lo hacemos a mano.
  //Primero miramos si la columna ya existe para no intentar crearla dos veces
  const qi = sequelize.getQueryInterface();
  const columnasReports = await qi.describeTable("Reports");
  if (!columnasReports.nota_revision) {
    await qi.addColumn("Reports", "nota_revision", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
  console.log("Modelos sincronizados con instantlovedb");
  app.listen(PORT, () => {
    console.log(
      `Servidor HTTP en ejecución en puerto http://localhost:${PORT}.`,
    );
  });
};

iniciarServidor().catch((err) => {
  console.error("Error fatal al arrancar el servidor:", err);
  process.exit(1);
});
