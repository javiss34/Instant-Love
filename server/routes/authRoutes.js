import express from 'express';
import { authController } from '../controllers/index.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verifyToken);

export default router;
