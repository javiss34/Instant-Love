import express from "express";
import { registrarVoto } from "../controllers/outcomeController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/:callId", verificarToken, registrarVoto);

export default router;
