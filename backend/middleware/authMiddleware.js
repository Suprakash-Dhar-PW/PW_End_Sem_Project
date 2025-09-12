const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate JWT token
 */
exports.authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token.' });
            }
            
            // Check if user exists
            try {
                const user = await User.findById(decoded.id);
                
                if (!user) {
                    return res.status(404).json({ error: 'User not found.' });
                }
                
                // Add user to request object
                req.user = user;
                next();
            } catch (error) {
                console.error('Error finding user:', error);
                return res.status(500).json({ error: 'Internal server error.' });
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.username === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
};