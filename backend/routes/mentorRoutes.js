const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const mentorController = require('../controllers/mentorController');

// This file will be used to handle mentor-related routes
// including mentor attendance, profiles, and management

// @route   GET /api/mentors
// @desc    Get all mentors
// @access  Admin
router.get('/', adminMiddleware, mentorController.getAllMentors);

// @route   GET /api/mentors/attendance
// @desc    Get mentor attendance records
// @access  Admin
router.get('/attendance', adminMiddleware, mentorController.getMentorAttendance);

// @route   POST /api/mentors/attendance
// @desc    Create mentor attendance record
// @access  Admin
router.post('/attendance', adminMiddleware, [
  check('mentorId', 'Mentor ID is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('status', 'Status is required').not().isEmpty()
], mentorController.createAttendance);

// @route   PUT /api/mentors/attendance/:id
// @desc    Update mentor attendance record
// @access  Admin
router.put('/attendance/:id', adminMiddleware, mentorController.updateAttendance);

// @route   DELETE /api/mentors/attendance/:id
// @desc    Delete mentor attendance record
// @access  Admin
router.delete('/attendance/:id', adminMiddleware, mentorController.deleteAttendance);

module.exports = router;