import express from "express";
import {
  iniciarLlamada,
  finalizarLlamada,
} from "../controllers/callController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/iniciar", verificarToken, iniciarLlamada);
router.put("/finalizar/:id", verificarToken, finalizarLlamada);

export default router;
