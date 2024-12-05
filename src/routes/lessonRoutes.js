const express = require('express');
const router = express.Router();
const { createLesson, getLessonsByCourse, getLessonById } = require('../controllers/lessonController');

router.post('/', createLesson);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:lessonId', getLessonById);

module.exports = router;