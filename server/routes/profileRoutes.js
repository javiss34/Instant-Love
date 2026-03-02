import express from "express";
import {
  obtenerPerfil,
  actualizarPerfil,
} from "../controllers/profileController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", verificarToken, obtenerPerfil);
router.put("/:id", verificarToken, actualizarPerfil);

export default router;
