const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   GET /api/dashboard
// @desc    Get all dashboard data
// @access  Private
router.get('/', authMiddleware, dashboardController.getDashboardData);

// Semester Cards Routes
// @route   GET /api/dashboard/semester-cards
// @desc    Get all semester cards
// @access  Private
router.get('/semester-cards', authMiddleware, dashboardController.getAllSemesterCards);

// @route   GET /api/dashboard/semester-cards/:id
// @desc    Get semester card by ID
// @access  Private
router.get('/semester-cards/:id', authMiddleware, dashboardController.getSemesterCardById);

// @route   POST /api/dashboard/semester-cards
// @desc    Create a new semester card
// @access  Admin
router.post(
  '/semester-cards',
  adminMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('link', 'Link must be a URL').optional().isURL()
  ],
  dashboardController.createSemesterCard
);

// @route   PUT /api/dashboard/semester-cards/:id
// @desc    Update a semester card
// @access  Admin
router.put(
  '/semester-cards/:id',
  adminMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('link', 'Link must be a URL').optional().isURL()
  ],
  dashboardController.updateSemesterCard
);

// @route   DELETE /api/dashboard/semester-cards/:id
// @desc    Delete a semester card
// @access  Admin
router.delete('/semester-cards/:id', adminMiddleware, dashboardController.deleteSemesterCard);

// Notices Routes
// @route   GET /api/dashboard/notices
// @desc    Get all notices
// @access  Private
router.get('/notices', authMiddleware, dashboardController.getAllNotices);

// @route   GET /api/dashboard/notices/:id
// @desc    Get notice by ID
// @access  Private
router.get('/notices/:id', authMiddleware, dashboardController.getNoticeById);

// @route   POST /api/dashboard/notices
// @desc    Create a new notice
// @access  Admin
router.post(
  '/notices',
  adminMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  dashboardController.createNotice
);

// @route   PUT /api/dashboard/notices/:id
// @desc    Update a notice
// @access  Admin
router.put(
  '/notices/:id',
  adminMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  dashboardController.updateNotice
);

// @route   DELETE /api/dashboard/notices/:id
// @desc    Delete a notice
// @access  Admin
router.delete('/notices/:id', adminMiddleware, dashboardController.deleteNotice);

// Quick Links Routes
// @route   GET /api/dashboard/quick-links
// @desc    Get all quick links
// @access  Private
router.get('/quick-links', authMiddleware, dashboardController.getAllQuickLinks);

// @route   GET /api/dashboard/quick-links/:id
// @desc    Get quick link by ID
// @access  Private
router.get('/quick-links/:id', authMiddleware, dashboardController.getQuickLinkById);

// @route   POST /api/dashboard/quick-links
// @desc    Create a new quick link
// @access  Admin
router.post(
  '/quick-links',
  adminMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('url', 'URL is required and must be valid').isURL()
  ],
  dashboardController.createQuickLink
);

// @route   PUT /api/dashboard/quick-links/:id
// @desc    Update a quick link
// @access  Admin
router.put(
  '/quick-links/:id',
  adminMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('url', 'URL is required and must be valid').isURL()
  ],
  dashboardController.updateQuickLink
);

// @route   DELETE /api/dashboard/quick-links/:id
// @desc    Delete a quick link
// @access  Admin
router.delete('/quick-links/:id', adminMiddleware, dashboardController.deleteQuickLink);

module.exports = router;