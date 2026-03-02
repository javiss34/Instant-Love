import express from 'express';
import { callController } from '../controllers/index.js';

const router = express.Router();

// Rutas de videollamadas (requieren autenticación)
router.post('/start', callController.startCall);
router.put('/:callId/end', callController.endCall);
router.get('/history', callController.getCallHistory);
router.get('/:callId', callController.getCallById);
router.get('/:callId/token', callController.generateRoomToken);

export default router;
