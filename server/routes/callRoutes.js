import express from "express";
import {
  iniciarLlamada,
  finalizarLlamada,
  unirseAColaBusqueda,
  comprobarEstadoCola,
} from "../controllers/callController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/cola", verificarToken, unirseAColaBusqueda);
router.get("/cola", verificarToken, comprobarEstadoCola);
router.post("/", verificarToken, iniciarLlamada);
router.put("/finalizar/:id", verificarToken, finalizarLlamada);

export default router;
