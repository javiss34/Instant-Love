import express from "express"
import { obtenerPerfil, actualizarPerfil } from "../controllers/profileController.js"

const router = express.Router()

router.get("/:id", obtenerPerfil)
router.put("/:id", actualizarPerfil)

export default router;