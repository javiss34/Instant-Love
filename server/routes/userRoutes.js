import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

// Rutas de usuario (requieren autenticación)
router.get('/profile', userController.getProfile);
router.get('/candidates', userController.getCandidates);
router.get('/:id', userController.getUserById);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

export default router;
