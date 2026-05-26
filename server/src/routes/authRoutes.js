import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  eliminarCuenta,
} from "../controllers/authController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/registrar", registrarUsuario);
router.post("/iniciar-sesion", loginUsuario);
router.delete("/cuenta", verificarToken, eliminarCuenta);

export default router;
