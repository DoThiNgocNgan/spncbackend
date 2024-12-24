const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route bảo vệ để kiểm tra token
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.user });
});

module.exports = router; 