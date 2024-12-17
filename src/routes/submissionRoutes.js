const express = require('express');
const router = express.Router();
const { submitQuiz, submitCode, getSubmissionHistory } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/quiz', authMiddleware, submitQuiz);
router.post('/code', authMiddleware, submitCode);
router.get('/history/:exercise_id', authMiddleware, getSubmissionHistory);

module.exports = router;