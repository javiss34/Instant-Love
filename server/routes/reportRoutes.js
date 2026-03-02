import express from 'express';
import { reportController } from '../controllers/index.js';

const router = express.Router();

// Rutas de reportes (requieren autenticación)
router.post('/', reportController.createReport);
router.get('/my-reports', reportController.getMyReports);

// Rutas de admin
router.get('/all', reportController.getAllReports); // TODO: Agregar middleware isAdmin
router.get('/user/:userId', reportController.getReportsByUser); // TODO: Agregar middleware isAdmin
router.put('/:reportId', reportController.updateReportStatus); // TODO: Agregar middleware isAdmin
router.delete('/:reportId', reportController.deleteReport); // TODO: Agregar middleware isAdmin

export default router;
