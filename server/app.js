import express from 'express';
import cors from 'cors';
import {
  authRoutes,
  userRoutes,
  subscriptionRoutes,
  callRoutes,
  voteRoutes,
  reportRoutes
} from './routes/index.js';
import express from "express";
import cors from "cors";
import { sequelize, conectarDB } from "./config/db.js";
import "./models/index.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/reports', reportRoutes);

// Ruta de prueba
app.get('/api/saludo', (req,res) => {
    res.json({mensaje: 'Esto es Instant Love'})
})
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
