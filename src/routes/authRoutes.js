const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Route bảo vệ để kiểm tra token
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.user });
});

module.exports = router; 