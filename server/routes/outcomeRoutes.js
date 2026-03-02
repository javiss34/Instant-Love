import express from "express"
import { registrarVoto } from "../controllers/outcomeController.js"

const router = express.Router()

router.put("/:callId", registrarVoto)

export default router