import express from "express"
import { iniciarLlamada, finalizarLlamada } from "../controllers/callController.js"

const router = express.Router();

router.post("/iniciar", iniciarLlamada);
router.put("/finalizar/:id", finalizarLlamada);

export default router;