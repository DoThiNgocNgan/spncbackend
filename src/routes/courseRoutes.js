const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById } = require('../controllers/courseController');
const { getLessonsByCourse } = require('../controllers/lessonController');

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:courseId', getCourseById);
router.get('/:courseId/lessons', getLessonsByCourse);

module.exports = router;