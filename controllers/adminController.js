const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const authConfig = require('../config/auth');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const admin = await adminModel.findByUsername(username);
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await adminModel.verifyPassword(password, admin.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            authConfig.jwtSecret,
            { expiresIn: authConfig.jwtExpiry }
        );

        res.cookie(authConfig.jwtCookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ message: 'Login successful', username: admin.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie(authConfig.jwtCookieName);
    res.json({ message: 'Logout successful' });
};

exports.verify = async (req, res) => {
    res.json({ authenticated: true, user: req.user });
};

exports.createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const admin = await adminModel.create(username, password);
        res.status(201).json({ message: 'Admin created', id: admin.id });
    } catch (error) {
        console.error('Create admin error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        if (error.message) {
            return res.status(500).json({ error: 'Failed to create admin', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create admin' });
    }
};