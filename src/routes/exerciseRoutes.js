const express = require('express');
const { createExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin', 'teacher']), createExercise); // Only admin and teacher can create
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'teacher']), updateExercise); // Only admin and teacher can update
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'teacher']), deleteExercise); // Only admin and teacher can delete

module.exports = router;