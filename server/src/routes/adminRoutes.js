import express from "express";
import { listarUsuarios, cambiarRol, obtenerDetalle } from "../controllers/adminController.js";
import { verificarToken, esAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/usuarios", verificarToken, esAdmin, listarUsuarios);
router.get("/usuarios/:id", verificarToken, esAdmin, obtenerDetalle);
router.put("/usuarios/:id/rol", verificarToken, esAdmin, cambiarRol);

export default router;
