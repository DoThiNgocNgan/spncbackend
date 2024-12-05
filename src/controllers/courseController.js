const Course = require('../models/Course');

const createCourse = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const newCourse = new Course({ title, description, image });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().select('_id title description image');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCourse, getCourses, getCourseById };