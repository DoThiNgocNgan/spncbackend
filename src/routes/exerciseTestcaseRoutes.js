const express = require('express');
const { createTestcase, getTestcasesByExercise } = require('../controllers/exerciseTestcaseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin', 'teacher']), createTestcase);
router.get('/:exercise_id', authMiddleware, getTestcasesByExercise);

module.exports = router; 