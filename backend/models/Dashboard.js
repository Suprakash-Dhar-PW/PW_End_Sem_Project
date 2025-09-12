const db = require('../config/db');

class Dashboard {
  // Semester Cards
  static getAllSemesterCards() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM semester_cards ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getSemesterCardById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM semester_cards WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static createSemesterCard(title, description, link) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO semester_cards (title, description, link) VALUES (?, ?, ?)',
        [title, description, link],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, title, description, link });
          }
        }
      );
    });
  }

  static updateSemesterCard(id, title, description, link) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE semester_cards SET title = ?, description = ?, link = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, description, link, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, description, link, changes: this.changes });
          }
        }
      );
    });
  }

  static deleteSemesterCard(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM semester_cards WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, deleted: this.changes > 0 });
        }
      });
    });
  }

  // Notices
  static getAllNotices() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notices ORDER BY date DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getNoticeById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM notices WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static createNotice(title, message) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO notices (title, message) VALUES (?, ?)',
        [title, message],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, title, message });
          }
        }
      );
    });
  }

  static updateNotice(id, title, message) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE notices SET title = ?, message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, message, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, message, changes: this.changes });
          }
        }
      );
    });
  }

  static deleteNotice(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM notices WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, deleted: this.changes > 0 });
        }
      });
    });
  }

  // Quick Links
  static getAllQuickLinks() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM quick_links ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getQuickLinkById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM quick_links WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static createQuickLink(title, url, icon = null) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO quick_links (title, url, icon) VALUES (?, ?, ?)',
        [title, url, icon],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, title, url, icon });
          }
        }
      );
    });
  }

  static updateQuickLink(id, title, url, icon = null) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE quick_links SET title = ?, url = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, url, icon, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, url, icon, changes: this.changes });
          }
        }
      );
    });
  }

  static deleteQuickLink(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM quick_links WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, deleted: this.changes > 0 });
        }
      });
    });
  }

  // Get all dashboard data
  static async getAllDashboardData() {
    try {
      const semesterCards = await this.getAllSemesterCards();
      const notices = await this.getAllNotices();
      const quickLinks = await this.getAllQuickLinks();

      return {
        semesterCards,
        notices,
        quickLinks
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Dashboard;