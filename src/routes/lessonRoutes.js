const express = require('express');
const router = express.Router();
const { createLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson } = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', createLesson);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:lessonId', getLessonById);
router.put(
    '/:lessonId', 
    [authMiddleware, roleMiddleware(['admin', 'teacher'])], 
    updateLesson
);
router.delete(
    '/:lessonId', 
    [authMiddleware, roleMiddleware(['admin', 'teacher'])], 
    deleteLesson
);

module.exports = router;