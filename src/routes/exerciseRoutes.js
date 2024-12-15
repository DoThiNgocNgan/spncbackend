const express = require('express');
const router = express.Router();
const { 
    createExercise, 
    getExercisesByCourse, 
    getExercisesByLesson,
    deleteExercise,
    getExerciseById
} = require('../controllers/exerciseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload, handleMulterError } = require('../middleware/uploadMiddleware');

// Routes với xử lý file
router.post('/', [
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    upload.single('pdfFile'),
    handleMulterError,
    createExercise
]);

// Các routes khác
router.get('/course/:courseId', authMiddleware, getExercisesByCourse);
router.get('/lesson/:lessonId', authMiddleware, getExercisesByLesson);
router.get('/:id', authMiddleware, getExerciseById);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'teacher']), deleteExercise);

module.exports = router;