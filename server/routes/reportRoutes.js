import express from "express"
import { crearReporte, obtenerReportes } from "../controllers/reportController.js"

const router = express.Router()

router.post("/", crearReporte)
router.get("/", obtenerReportes)

export default router