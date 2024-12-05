const express = require('express');
const { submitExercise, getStudentExercises } = require('../controllers/studentExerciseController');
const router = express.Router();

router.post('/', submitExercise);
router.get('/:user_id', getStudentExercises);

module.exports = router; 