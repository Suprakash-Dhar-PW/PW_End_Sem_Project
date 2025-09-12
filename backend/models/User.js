const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Find user by username or email
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      // Check if input is an email (contains @)
      const isEmail = username.includes('@');
      
      // If it's admin@pwioi.com, handle it specially
      if (username === 'admin@pwioi.com') {
        // Admin is handled directly in authController
        resolve(null);
        return;
      }
      
      // Query by username or email based on the input format
      const query = isEmail ? 
        'SELECT * FROM users WHERE email = ?' : 
        'SELECT * FROM users WHERE username = ?';
      
      db.get(query, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Find user by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Create a new user
  static create(username, password, role = 'student', email = null) {
    return new Promise((resolve, reject) => {
      // If email is not provided, use username as email if it looks like an email
      if (!email && username.includes('@')) {
        email = username;
      }
      
      // Hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          // Insert user with hashed password and email
          db.run(
            'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
            [username, hash, role, email],
            function(err) {
              if (err) {
                reject(err);
              } else {
                resolve({ id: this.lastID, username, role, email });
              }
            }
          );
        }
      });
    });
  }

  // Compare password
  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Get all users (for admin)
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, role, created_at FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = User;