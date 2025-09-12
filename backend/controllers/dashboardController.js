const { validationResult } = require('express-validator');
const Dashboard = require('../models/Dashboard');

// Get all dashboard data
exports.getDashboardData = async (req, res, next) => {
  try {
    const dashboardData = await Dashboard.getAllDashboardData();
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
};

// Semester Cards Controllers
exports.getAllSemesterCards = async (req, res, next) => {
  try {
    const semesterCards = await Dashboard.getAllSemesterCards();
    res.json(semesterCards);
  } catch (err) {
    next(err);
  }
};

exports.getSemesterCardById = async (req, res, next) => {
  try {
    const semesterCard = await Dashboard.getSemesterCardById(req.params.id);
    if (!semesterCard) {
      return res.status(404).json({ message: 'Semester card not found' });
    }
    res.json(semesterCard);
  } catch (err) {
    next(err);
  }
};

exports.createSemesterCard = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, link } = req.body;
    const semesterCard = await Dashboard.createSemesterCard(title, description, link);
    res.status(201).json(semesterCard);
  } catch (err) {
    next(err);
  }
};

exports.updateSemesterCard = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, link } = req.body;
    const semesterCard = await Dashboard.updateSemesterCard(req.params.id, title, description, link);
    
    if (semesterCard.changes === 0) {
      return res.status(404).json({ message: 'Semester card not found' });
    }
    
    res.json(semesterCard);
  } catch (err) {
    next(err);
  }
};

exports.deleteSemesterCard = async (req, res, next) => {
  try {
    const result = await Dashboard.deleteSemesterCard(req.params.id);
    
    if (!result.deleted) {
      return res.status(404).json({ message: 'Semester card not found' });
    }
    
    res.json({ message: 'Semester card deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Notices Controllers
exports.getAllNotices = async (req, res, next) => {
  try {
    const notices = await Dashboard.getAllNotices();
    res.json(notices);
  } catch (err) {
    next(err);
  }
};

exports.getNoticeById = async (req, res, next) => {
  try {
    const notice = await Dashboard.getNoticeById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (err) {
    next(err);
  }
};

exports.createNotice = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message } = req.body;
    const notice = await Dashboard.createNotice(title, message);
    res.status(201).json(notice);
  } catch (err) {
    next(err);
  }
};

exports.updateNotice = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message } = req.body;
    const notice = await Dashboard.updateNotice(req.params.id, title, message);
    
    if (notice.changes === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.json(notice);
  } catch (err) {
    next(err);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const result = await Dashboard.deleteNotice(req.params.id);
    
    if (!result.deleted) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Quick Links Controllers
exports.getAllQuickLinks = async (req, res, next) => {
  try {
    const quickLinks = await Dashboard.getAllQuickLinks();
    res.json(quickLinks);
  } catch (err) {
    next(err);
  }
};

exports.getQuickLinkById = async (req, res, next) => {
  try {
    const quickLink = await Dashboard.getQuickLinkById(req.params.id);
    if (!quickLink) {
      return res.status(404).json({ message: 'Quick link not found' });
    }
    res.json(quickLink);
  } catch (err) {
    next(err);
  }
};

exports.createQuickLink = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, icon } = req.body;
    const quickLink = await Dashboard.createQuickLink(title, url, icon);
    res.status(201).json(quickLink);
  } catch (err) {
    next(err);
  }
};

exports.updateQuickLink = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, icon } = req.body;
    const quickLink = await Dashboard.updateQuickLink(req.params.id, title, url, icon);
    
    if (quickLink.changes === 0) {
      return res.status(404).json({ message: 'Quick link not found' });
    }
    
    res.json(quickLink);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuickLink = async (req, res, next) => {
  try {
    const result = await Dashboard.deleteQuickLink(req.params.id);
    
    if (!result.deleted) {
      return res.status(404).json({ message: 'Quick link not found' });
    }
    
    res.json({ message: 'Quick link deleted successfully' });
  } catch (err) {
    next(err);
  }
};