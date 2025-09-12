const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');

// Activity routes
router.post('/log', authMiddleware.authenticateToken, pdfController.logActivity);
router.get('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, pdfController.getAllActivities);

module.exports = router;