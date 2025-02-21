const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Get user from auth middleware
        const user = req.user;

        // Check if user exists and is an admin
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
