import express from "express";
import { obtenerEstadisticas } from "../controllers/statsController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, obtenerEstadisticas);

export default router;
