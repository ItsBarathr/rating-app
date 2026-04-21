const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const authenticateToken = (req, res, next) => {
    const token = req.cookies[authConfig.jwtCookieName] || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, authConfig.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const optionalAuth = (req, res, next) => {
    const token = req.cookies[authConfig.jwtCookieName] || req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, authConfig.jwtSecret, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};

module.exports = { authenticateToken, optionalAuth };