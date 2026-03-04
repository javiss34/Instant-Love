import express from "express";
import {
  obtenerPerfil,
  actualizarPerfil,
  eliminarPerfil
} from "../controllers/profileController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", verificarToken, obtenerPerfil);
router.put("/:id", verificarToken, actualizarPerfil);
router.delete("/:id", verificarToken, eliminarPerfil);

export default router;
