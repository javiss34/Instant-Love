import express from 'express';
import { voteController } from '../controllers/index.js';

const router = express.Router();

// Rutas de votos (requieren autenticación)
router.post('/', voteController.createVote);
router.get('/matches', voteController.getMatches);
router.get('/pending', voteController.getPendingMatches);
router.get('/stats', voteController.getVoteStats);
router.delete('/matches/:matchedUserId', voteController.deleteMatch);

export default router;
