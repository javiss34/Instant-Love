import express from 'express';
import { subscriptionController } from '../controllers/index.js';

const router = express.Router();

// Rutas de suscripciones (requieren autenticación)
router.get('/active', subscriptionController.getActiveSubscription);
router.get('/history', subscriptionController.getSubscriptionHistory);
router.get('/premium-status', subscriptionController.checkPremiumStatus);
router.post('/', subscriptionController.createSubscription);
router.delete('/:subscriptionId', subscriptionController.cancelSubscription);

export default router;
