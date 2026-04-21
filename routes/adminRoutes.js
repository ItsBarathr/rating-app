const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', adminController.login);
router.post('/logout', authenticateToken, adminController.logout);
router.get('/verify', authenticateToken, adminController.verify);
router.post('/create', adminController.createAdmin);

module.exports = router;