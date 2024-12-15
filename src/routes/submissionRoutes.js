const express = require('express');
const router = express.Router();
const { submitQuiz, getSubmissionHistory } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/quiz', authMiddleware, submitQuiz);
router.get('/history/:exercise_id', authMiddleware, getSubmissionHistory);

module.exports = router;