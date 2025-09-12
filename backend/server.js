const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const pdfRoutes = require('./routes/pdfRoutes');
const activityRoutes = require('./routes/activityRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const dsaRoutes = require('./routes/dsaRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');

// Initialize express app
const app = express();

// Initialize database
require('./config/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/dsa', dsaRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});