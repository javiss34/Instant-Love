import express from "express";
import {
  crearReporte,
  obtenerReportes,
  actualizarEstadoReporte,
} from "../controllers/reportController.js";
import { verificarToken, esAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, crearReporte);
router.get("/", verificarToken, esAdmin, obtenerReportes);
router.patch("/:id/estado", verificarToken, esAdmin, actualizarEstadoReporte);

export default router;
