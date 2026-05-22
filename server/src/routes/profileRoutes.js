import express from "express";
import {
  obtenerPerfil,
  actualizarPerfil,
  eliminarPerfil,
  verPerfilPublico
} from "../controllers/profileController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id",verificarToken,verPerfilPublico)
router.get("/", verificarToken, obtenerPerfil);
router.put("/", verificarToken, actualizarPerfil);
router.delete("/", verificarToken, eliminarPerfil);

export default router;
