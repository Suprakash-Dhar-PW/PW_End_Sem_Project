const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');

// PDF routes
router.post('/upload', authMiddleware.authenticateToken, pdfController.uploadPDFs);
router.get('/', authMiddleware.authenticateToken, pdfController.getAllPDFs);
router.get('/:id', authMiddleware.authenticateToken, pdfController.getPDFById);
router.delete('/:id', authMiddleware.authenticateToken, pdfController.deletePDF);
router.post('/merge', authMiddleware.authenticateToken, pdfController.mergePDFs);
router.post('/qr-card', authMiddleware.authenticateToken, pdfController.createQRCard);

// Activity routes
router.post('/activities/log', authMiddleware.authenticateToken, pdfController.logActivity);
router.get('/activities', authMiddleware.authenticateToken, pdfController.getAllActivities);

module.exports = router;