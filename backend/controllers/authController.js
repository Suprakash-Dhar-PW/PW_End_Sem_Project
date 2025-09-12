const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
require('dotenv').config();

// Login user
exports.login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    
    // Special case for admin login
    if (username === 'admin@pwioi.com') {
      if (password === 'admin123') {
        // Create JWT payload for admin
        const payload = {
          user: {
            id: 'admin',
            username: 'admin@pwioi.com',
            role: 'admin'
          }
        };
        
        // Sign token for admin
        return jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '24h' },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: 'admin',
                username: 'admin@pwioi.com',
                role: 'admin'
              }
            });
          }
        );
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // For regular users, find by username (email)
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

// Register user (for admin to create student accounts)
exports.register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role = 'student', email } = req.body;

    // Check if email is admin's email
    if (email === 'admin@pwioi.com') {
      return res.status(400).json({ message: 'This email is reserved for admin use' });
    }
    
    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this username' });
    }
    
    // If email is provided, check if it's already in use
    if (email) {
      const existingEmail = await User.findByUsername(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
    }

    // Create user with email if provided
    const user = await User.create(username, password, role, email);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};