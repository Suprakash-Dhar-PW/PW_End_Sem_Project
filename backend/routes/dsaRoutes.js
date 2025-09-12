const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const dsaController = require('../controllers/dsaController');

// This file will be used to handle DSA-related routes
// including problems, leaderboard, and tracking

// @route   GET /api/dsa/problems
// @desc    Get all DSA problems
// @access  Private
router.get('/problems', authMiddleware, dsaController.getAllProblems);

// @route   GET /api/dsa/problems/:id
// @desc    Get DSA problem by ID
// @access  Private
router.get('/problems/:id', authMiddleware, dsaController.getProblemById);

// @route   POST /api/dsa/problems
// @desc    Create a new DSA problem
// @access  Admin
router.post('/problems', adminMiddleware, [
  check('title', 'Title is required').not().isEmpty(),
  check('difficulty', 'Difficulty is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty()
], dsaController.createProblem);

// @route   PUT /api/dsa/problems/:id
// @desc    Update a DSA problem
// @access  Admin
router.put('/problems/:id', adminMiddleware, dsaController.updateProblem);

// @route   DELETE /api/dsa/problems/:id
// @desc    Delete a DSA problem
// @access  Admin
router.delete('/problems/:id', adminMiddleware, dsaController.deleteProblem);

// @route   GET /api/dsa/leaderboard
// @desc    Get DSA leaderboard
// @access  Private
router.get('/leaderboard', authMiddleware, dsaController.getLeaderboard);

// @route   PUT /api/dsa/leaderboard/:userId
// @desc    Update user points on leaderboard
// @access  Admin
router.put('/leaderboard/:userId', adminMiddleware, [
  check('points', 'Points value is required').isNumeric()
], dsaController.updateUserPoints);

// @route   POST /api/dsa/submissions
// @desc    Submit a DSA problem solution
// @access  Private
router.post('/submissions', authMiddleware, [
  check('problemId', 'Problem ID is required').not().isEmpty(),
  check('solution', 'Solution is required').not().isEmpty()
], dsaController.submitSolution);

module.exports = router;